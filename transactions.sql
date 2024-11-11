
                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE BankAccount 
                SET "Balance" = "Balance" - $1 
                WHERE CustomerID = $2
                COMMIT
                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE BankAccount 
                SET "Balance" = "Balance" - $1 
                WHERE CustomerID = $2
                COMMIT

ROLLBACK

ROLLBACK


                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = AmountDue + $5
                WHERE CustomerID = $6
                COMMIT
            


                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = AmountDue + $5
                WHERE CustomerID = $6
                COMMIT
            

ROLLBACK

ROLLBACK

ROLLBACK


                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = AmountDue + $5
                WHERE CustomerID = $6
                COMMIT
            


                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = AmountDue + $5
                WHERE CustomerID = $6
                COMMIT
            


                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = AmountDue + $5
                WHERE CustomerID = $6
                COMMIT
            


                BEGIN
                INSERT INTO Payment (CustomerID, PaymentTypeID, payment_date, payment_amount) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 - $6
                WHERE CustomerID = $7
                COMMIT
            


                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 + COALESCE(AmountDue, 0)
                WHERE CustomerID = $6
                COMMIT
            


                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 + COALESCE(AmountDue, 0)
                WHERE CustomerID = $6
                COMMIT
            


                BEGIN
                INSERT INTO Payment (CustomerID, PaymentTypeID, payment_date, payment_amount) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 - $6
                WHERE CustomerID = $7
                COMMIT
            


                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 + COALESCE(AmountDue, 0)
                WHERE CustomerID = $6
                COMMIT
            


                BEGIN
                INSERT INTO Payment (CustomerID, PaymentTypeID, payment_date, payment_amount) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 - $6
                WHERE CustomerID = $7
                COMMIT
            


                BEGIN
                INSERT INTO Payment (CustomerID, PaymentTypeID, payment_date, payment_amount) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 - $6
                WHERE CustomerID = $7
                COMMIT
            


                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 + COALESCE(AmountDue, 0)
                WHERE CustomerID = $6
                COMMIT
            


                BEGIN
                INSERT INTO Payment (CustomerID, PaymentTypeID, payment_date, payment_amount) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 - $6
                WHERE CustomerID = $7
                COMMIT
            


                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 + COALESCE(AmountDue, 0)
                WHERE CustomerID = $6
                COMMIT
            


                BEGIN
                INSERT INTO Payment (CustomerID, PaymentTypeID, payment_date, payment_amount) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 - $6
                WHERE CustomerID = $7
                COMMIT
            


                BEGIN
                INSERT INTO CallRecord (CustomerID, call_date, call_length_min, cost) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 + COALESCE(AmountDue, 0)
                WHERE CustomerID = $6
                COMMIT
            


                BEGIN
                INSERT INTO Payment (CustomerID, PaymentTypeID, payment_date, payment_amount) 
                VALUES ($1, $2, $3, $4)
                UPDATE Customer 
                SET AmountDue = $5 - $6
                WHERE CustomerID = $7
                COMMIT
            

