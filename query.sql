SELECT C.first_name AS fname, C.last_name AS lname, CR.call_date AS cdate, CR.call_length_min AS callmin, CR.cost AS callcost, BA."Balance" AS rembalance
            FROM CallRecord  CR
            JOIN Customer C on CR.CustomerID = C.CustomerID
            JOIN BankAccount BA ON C.CustomerID = BA.CustomerID
            WHERE C.CustomerID = $1