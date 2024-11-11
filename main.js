const express = require('express');
const { Pool } = require('pg');
const app = express();
const port = 3000;

const creds = require('./creds.json');
const pool = new Pool(creds);

app.use(express.urlencoded({extended: true}));

app.get('/', async (req, res) => {
    const customerId = req.query.customerId;
    let transactionsHtml = "";
    let totalPrice = 0;
    let customerName = "";

    if (customerId) {
        try {
            const q = `SELECT C.first_name AS fname, C.last_name AS lname, CR.call_date AS cdate, CR.call_length_min AS callmin, CR.cost AS callcost, BA."Balance" AS rembalance
            FROM CallRecord  CR
            JOIN Customer C on CR.CustomerID = C.CustomerID
            JOIN BankAccount BA ON C.CustomerID = BA.CustomerID
            WHERE C.CustomerID = $1`
            const result = await pool.query(q, [customerId]);
            const fs = require('fs');
            fs.writeFile('query.sql', q, err=>{
                if (err) {
                    console.error(err);
                }
            });
            if (result.rows.length > 0) {
                customerName = result.rows[0].fname + " " + result.rows[0].lname; 
                transactionsHtml = result.rows.map(row => {
                    const cost = parseFloat(row.callcost);
                    totalPrice += cost;
                    return `Call Length: ${row.callmin} Minutes, Price: ${row.callcost}, Date: ${row.cdate}</p>`;
                }).join('');
            }
        } catch (err) {
            return res.status(500).send("Error: " + err.message);
        }
    }

    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Call Search</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }

                h1, h2, h3 {
                    color: #333;
                    text-align: center;
                }

                form {
                    text-align: center;
                    margin-top: 20px;
                }

                label {
                    display: block;
                    margin: 10px 0;
                    font-weight: bold;
                }

                input {
                    padding: 8px;
                    margin-bottom: 10px;
                }

                button {
                    padding: 10px;
                    background-color: #4caf50;
                    color: white;
                    border: none;
                    cursor: pointer;
                }

                button:hover {
                    background-color: #45a049;
                }

                .container {
                    max-width: 800px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                a {
                    color: #3498db;
                    text-decoration: none;
                }

                a:hover {
                    text-decoration: underline;
                }

                p {
                    color: #555;
                }

                /* Add more styles as needed */
            </style>
        </head>
        <body>
            <div class="container">
                <h1>Transactions in Phone Calls</h1>
                <form action="/" method="GET">
                    <label for="customerId">Enter Customer ID:</label>
                    <input type="number" name="customerId" id="customerId" required>
                    <button type="submit">Get Calls</button>
                </form>

                ${customerName ? `<h2>Customer's Name: ${customerName}</h2>` : '<h2>Enter a Customer ID (1-10) to view transactions.</h2>'}
                <div>
                    <h3>Transactions:</h3>
                    ${transactionsHtml}
                    ${transactionsHtml ? `<p>Total Price: ${totalPrice}</p>` : ''}
                </div>
                <a href="/new-call-record">Click to submit a new call record</a><br><br>
                <a href="/plans">Click to check your plan</a><br><br>
                <a href="/bank-account">Click for Balance, Amount Due, and Bank Account</a><br><br>
                <a href="/make-payment">Click to make a payment</a>
            </div>
        </body>
        </html>
    `);
});

app.get('/new-call-record', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Call Record</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }

                h1 {
                    color: #333;
                    text-align: center;
                }

                form {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                label {
                    display: block;
                    margin: 10px 0;
                    font-weight: bold;
                }

                input {
                    padding: 8px;
                    margin-bottom: 10px;
                    width: 100%;
                    box-sizing: border-box;
                }

                button {
                    padding: 10px;
                    background-color: #4caf50;
                    color: white;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                }

                button:hover {
                    background-color: #45a049;
                }

                a {
                    color: #3498db;
                    text-decoration: none;
                    display: block;
                    text-align: center;
                    margin-top: 20px;
                }

                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>Enter New Call Record Information</h1>
            <form action="/submit-call-record" method="POST">
                <label for="customerId">Customer ID (1-10):</label>
                <input type="number" name="customerId" id="customerId" required>
                <br>
                <label for="callDate">Call Date:</label>
                <input type="date" name="callDate" id="callDate" required>
                <br>
                <label for="callLength">Call Length (Minutes):</label>
                <input type="number" name="callLength" id="callLength" required>
                <br>
                <label for="callCost">Call Cost (Just put 0, will calculate):</label>
                <input type="number" step="0.01" name="callCost" id="callCost" required>
                <br>
                <button type="submit">Submit Call Record</button>
            </form>
            <a href="/">Return to Home</a>
        </body>
        </html>
    `);
});

app.post('/submit-call-record', async (req, res) => {
    const starttime = new Date();
    const customerId = req.body.customerId;
    const callDate = req.body.callDate;
    const callLength = req.body.callLength;
    let callCost = req.body.callCost;
    const rate = 0.05; // $0.05 per minute on call

    if (!customerId || !callDate || !callLength) {
        return res.status(400).send('All fields are required');
    }

    try {
        callCost = callLength * rate;
        try {
            await pool.query(`BEGIN`);

            await pool.query(`
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
            `, [customerId, callDate, callLength, callCost]);

            await pool.query(`
                UPDATE Customer 
                SET AmountDue = $1::numeric + COALESCE(AmountDue, 0)
                WHERE CustomerID = $2
            `, [callCost, customerId]);

            await pool.query(`COMMIT`);
            const endtime = new Date();
            const transactionduration = endtime - starttime;
            const q = `
                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 + COALESCE(AmountDue, 0)
                WHERE CustomerID = $6
                COMMIT
            `;
            const fs = require('fs');
            fs.appendFile('transactions.sql', q + '\n\n', (err) => {
                if (err) {
                    console.error(err);
                }
            });

            return res.status(200).send(`Call record inserted successfully. Transaction duration: ${transactionduration} milliseconds. <a href="/">Return to Home</a>`);
        } catch (error) {
            await pool.query(`ROLLBACK`);
            const fs = require('fs');
            fs.appendFile('transactions.sql', `ROLLBACK` + '\n\n', (err) => {
                if (err) {
                    console.error(err);
                }
            });
            return res.status(500).send('Error: ' + error.message);
        }
    } catch (error) {
        return res.status(500).send('Error: ' + error.message);
    }
});

    
app.get('/plans', async (req, res) => {
    const customerId = req.query.customerId;

    if (customerId) {
        try {
            const q = `
                SELECT C.first_name AS fname, C.last_name AS lname, P.plan_name, P.monthly_fee, P.call_minutes_limit, P.prepaid, PP.billing_cycle_start
                FROM Customer C
                JOIN PhonePlan P ON C.PlanID = P.PlanID
                LEFT JOIN PostPaidPlan PP ON C.PlanID = PP.PlanID
                WHERE C.CustomerID = $1
            `;
            const result = await pool.query(q, [customerId]);
            const fs = require('fs');
            fs.appendFile('query.sql', q + '\n\n', err => {
                if (err) {
                    console.error(err);
                }
            });
            if (result.rows.length > 0) {
                const customerName = result.rows[0].fname + " " + result.rows[0].lname;
                const planName = result.rows[0].plan_name;
                const monthlyFee = result.rows[0].monthly_fee;
                const callMinutesLimit = result.rows[0].call_minutes_limit;
                const prepaid = result.rows[0].prepaid;
                const billingCycleStart = result.rows[0].billing_cycle_start;

                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Plans</title>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                background-color: #f4f4f4;
                                margin: 0;
                                padding: 0;
                            }

                            h1, h2, h3 {
                                color: #333;
                                text-align: center;
                            }

                            .container {
                                max-width: 800px;
                                margin: 20px auto;
                                background-color: #fff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }

                            p {
                                color: #555;
                            }

                            a {
                                color: #3498db;
                                text-decoration: none;
                                display: block;
                                text-align: center;
                                margin-top: 20px;
                            }

                            a:hover {
                                text-decoration: underline;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Phone Plan Information</h1>
                            <h2>Customer: ${customerName}</h2>
                            <h3>Plan Details:</h3>
                            <p>Plan Name: ${planName}</p>
                            <p>Monthly Fee: $${monthlyFee}</p>
                            <p>Call Minutes Limit: ${callMinutesLimit}</p>
                            <p>Prepaid: ${prepaid ? 'Yes' : 'No'}</p>
                            ${!prepaid ? `<p>Billing Cycle Start: ${billingCycleStart}</p>` : ''}
                            <a href="/">Return to Home</a>
                        </div>
                    </body>
                    </html>
                `);
            } else {
                res.send(`<h2>No plan information found for CustomerID: ${customerId}</h2><a href="/">Return to Home</a>`);
            }
        } catch (err) {
            return res.status(500).send("Error: " + err.message);
        }
    } else {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Plans</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }

                    h1 {
                        color: #333;
                        text-align: center;
                    }

                    form {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }

                    label {
                        display: block;
                        margin: 10px 0;
                        font-weight: bold;
                    }

                    input {
                        padding: 8px;
                        margin-bottom: 10px;
                        width: 100%;
                        box-sizing: border-box;
                    }

                    button {
                        padding: 10px;
                        background-color: #4caf50;
                        color: white;
                        border: none;
                        cursor: pointer;
                        width: 100%;
                    }

                    button:hover {
                        background-color: #45a049;
                    }

                    a {
                        color: #3498db;
                        text-decoration: none;
                        display: block;
                        text-align: center;
                        margin-top: 20px;
                    }

                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <h1>Enter CustomerID to view your plan</h1>
                <form action="/plans" method="GET">
                    <label for="customerId">Customer ID (1-10):</label>
                    <input type="number" name="customerId" id="customerId" required>
                    <button type="submit">Get Phone Plan</button>
                </form>
                <br>
                <a href="/">Return to Home</a>
            </body>
            </html>
        `);
    }
});

app.get('/bank-account', async (req, res) => {
    const customerId = req.query.customerId;

    if (customerId) {
        try {
            const q = `
                SELECT C.first_name AS fname, C.last_name AS lname, BA.AccountID AS accountid, BA."Balance", C.AmountDue AS amount_due
                FROM Customer C
                JOIN BankAccount BA ON C.CustomerID = BA.CustomerID
                WHERE C.CustomerID = $1
            `;
            const result = await pool.query(q, [customerId]);
            const fs = require('fs');
            fs.appendFile('query.sql', q + '\n\n', err => {
                if (err) {
                    console.error(err);
                }
            });
            if (result.rows.length > 0) {
                const customerName = result.rows[0].fname + " " + result.rows[0].lname;
                const accountId = result.rows[0].accountid;
                const balance = result.rows[0].Balance;
                const amountDue = result.rows[0].amount_due !== null ? parseFloat(result.rows[0].amount_due) : 0.00;
                const formatamount = !isNaN(amountDue) ? amountDue.toFixed(2) : '0.00';
                res.send(`
                    <!DOCTYPE html>
                    <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <title>Bank Account Information</title>
                        <style>
                            body {
                                font-family: 'Arial', sans-serif;
                                background-color: #f4f4f4;
                                margin: 0;
                                padding: 0;
                            }

                            h1, h2 {
                                color: #333;
                                text-align: center;
                            }

                            .container {
                                max-width: 800px;
                                margin: 20px auto;
                                background-color: #fff;
                                padding: 20px;
                                border-radius: 8px;
                                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                            }

                            p {
                                color: #555;
                            }

                            a {
                                color: #3498db;
                                text-decoration: none;
                                display: block;
                                text-align: center;
                                margin-top: 20px;
                            }

                            a:hover {
                                text-decoration: underline;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <h1>Bank Account Information</h1>
                            <h2>Customer: ${customerName}</h2>
                            <p>Bank Account ID: ${accountId}</p>
                            <p>Balance: $${balance}</p>
                            <p>Amount Due: $${formatamount}</p>
                            <a href="/">Return to Home</a>
                        </div>
                    </body>
                    </html>
                `);
            } else {
                res.send(`<h2>No bank account information found for CustomerID: ${customerId}</h2><a href="/">Return to Home</a>`);
            }
        } catch (err) {
            return res.status(500).send("Error: " + err.message);
        }
    } else {
        res.send(`
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Bank Account Information</title>
                <style>
                    body {
                        font-family: 'Arial', sans-serif;
                        background-color: #f4f4f4;
                        margin: 0;
                        padding: 0;
                    }

                    h1 {
                        color: #333;
                        text-align: center;
                    }

                    form {
                        max-width: 600px;
                        margin: 20px auto;
                        background-color: #fff;
                        padding: 20px;
                        border-radius: 8px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }

                    label {
                        display: block;
                        margin: 10px 0;
                        font-weight: bold;
                    }

                    input {
                        padding: 8px;
                        margin-bottom: 10px;
                        width: 100%;
                        box-sizing: border-box;
                    }

                    button {
                        padding: 10px;
                        background-color: #4caf50;
                        color: white;
                        border: none;
                        cursor: pointer;
                        width: 100%;
                    }

                    button:hover {
                        background-color: #45a049;
                    }

                    a {
                        color: #3498db;
                        text-decoration: none;
                        display: block;
                        text-align: center;
                        margin-top: 20px;
                    }

                    a:hover {
                        text-decoration: underline;
                    }
                </style>
            </head>
            <body>
                <h1>Enter CustomerID to view Bank Account Information</h1>
                <form action="/bank-account" method="GET">
                    <label for="customerId">Customer ID (1-10):</label>
                    <input type="number" name="customerId" id="customerId" required>
                    <button type="submit">Get Bank Account Info</button>
                </form>
                <br>
                <a href="/">Return to Home</a>
            </body>
            </html>
        `);
    }
});

app.get('/make-payment', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Make Payment</title>
            <style>
                body {
                    font-family: 'Arial', sans-serif;
                    background-color: #f4f4f4;
                    margin: 0;
                    padding: 0;
                }

                h1 {
                    color: #333;
                    text-align: center;
                }

                form {
                    max-width: 600px;
                    margin: 20px auto;
                    background-color: #fff;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                }

                label {
                    display: block;
                    margin: 10px 0;
                    font-weight: bold;
                }

                input {
                    padding: 8px;
                    margin-bottom: 10px;
                    width: 100%;
                    box-sizing: border-box;
                }

                button {
                    padding: 10px;
                    background-color: #4caf50;
                    color: white;
                    border: none;
                    cursor: pointer;
                    width: 100%;
                }

                button:hover {
                    background-color: #45a049;
                }

                a {
                    color: #3498db;
                    text-decoration: none;
                    display: block;
                    text-align: center;
                    margin-top: 20px;
                }

                a:hover {
                    text-decoration: underline;
                }
            </style>
        </head>
        <body>
            <h1>Make Payment</h1>
            <form action="/submit-payment" method="POST">
                <label for="customerId">Customer ID:</label>
                <input type="number" name="customerId" id="customerId" required>
                <br>
                <label for="paymentTypeId">Payment Type ID (1 for Automatic, 2 for Manual):</label>
                <input type="number" name="paymentTypeId" id="paymentTypeId" required>
                <br>
                <label for="paymentDate">Payment Date:</label>
                <input type="date" name="paymentDate" id="paymentDate" required>
                <br>
                <label for="paymentAmount">Payment Amount:</label>
                <input type="number" step="0.01" name="paymentAmount" id="paymentAmount" required>
                <br>
                <button type="submit">Submit Payment</button>
            </form>
            <a href="/">Return to Home</a>
        </body>
        </html>
    `);
});
      
app.post('/submit-payment', async (req, res) => {
    const start = new Date();
    const customerId = req.body.customerId;
    const paymentTypeId = req.body.paymentTypeId;
    const paymentDate = req.body.paymentDate;
    let paymentAmount = req.body.paymentAmount;

    if (!customerId || !paymentTypeId || !paymentDate || !paymentAmount) {
        return res.status(400).send('All fields are required');
    }

    try {
        const customerInfoQuery = await pool.query(`
            SELECT AmountDue 
            FROM Customer 
            WHERE CustomerID = $1
        `, [customerId]);

        const amountDue = customerInfoQuery.rows[0].AmountDue;

        if (paymentAmount > amountDue) {
            paymentAmount = amountDue;
        }

        try {
            await pool.query(`BEGIN`);

            await pool.query(`
                INSERT INTO Payment (CustomerID, PaymentTypeID, payment_date, payment_amount) 
                VALUES ($1, $2, $3, $4)
            `, [customerId, paymentTypeId, paymentDate, paymentAmount]);

            await pool.query(`
                UPDATE Customer 
                SET AmountDue = $1::numeric - $2::numeric
                WHERE CustomerID = $3
            `, [amountDue, paymentAmount, customerId]);

            await pool.query(`COMMIT`);
            const end = new Date();
            const totaltime = end - start;
            const q = `
                BEGIN
                INSERT INTO Payment (CustomerID, PaymentTypeID, payment_date, payment_amount) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 - $6
                WHERE CustomerID = $7
                COMMIT
            `;
            const fs = require('fs');
            fs.appendFile('transactions.sql', q + '\n\n', (err) => {
                if (err) {
                    console.error(err);
                }
            });

            return res.status(200).send(`Payment recorded successfully. Transaction Duration: ${totaltime} milliseconds.<a href="/">Return to Home</a>`);
        } catch (error) {
            await pool.query(`ROLLBACK`);
            const fs = require('fs');
            fs.appendFile('transactions.sql', `ROLLBACK` + '\n\n', (err) => {
                if (err) {
                    console.error(err);
                }
            });
            return res.status(500).send('Error: ' + error.message);
        }
    } catch (error) {
        return res.status(500).send('Error: ' + error.message);
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
