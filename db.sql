DROP TABLE IF EXISTS Customer;
DROP TABLE IF EXISTS PhonePlan;
DROP TABLE IF EXISTS PostPaidPlan;
DROP TABLE IF EXISTS CallRecord;
DROP TABLE IF EXISTS CallType;
DROP TABLE IF EXISTS DataUsageRecord;
DROP TABLE IF EXISTS DataPlan;
DROP TABLE IF EXISTS DataPayment;
DROP TABLE IF EXISTS Payment;
DROP TABLE IF EXISTS PaymentType;
DROP TABLE IF EXISTS BankAccount;

--Create Customer
CREATE TABLE Customer (
    CustomerID SERIAL PRIMARY KEY,
    first_name VARCHAR,
    last_name VARCHAR,
    home_address TEXT,
    phone_number VARCHAR,
    email VARCHAR,
    date_of_birth DATE,
    PlanID INT,
    AccountID INT,
    AmountDue NUMERIC(4,2)
);

INSERT INTO Customer (CustomerID, first_name, last_name, home_address, phone_number, email, date_of_birth, PlanID, AccountID, AmountDue)
VALUES
    (1, 'John', 'Doe', '123 Main St, CityA', '555-123-4567', 'john.doe@email.com', '1990-05-15', 101, 1, 0.00),
    (2, 'Jane', 'Smith', '456 Elm St, CityB', '555-987-6543', 'jane.smith@email.com', '1985-11-22', 102, 2, 0.00),
    (3, 'David', 'Williams', '789 Oak St, CityC', '555-555-1234', 'david@email.com', '1980-08-10', 103, 3, 0.00),
    (4, 'Sarah', 'Johnson', '101 Pine St, CityD', '555-333-9999', 'sarah@email.com', '1987-03-19', 104, 4, 0.00),
    (5, 'Michael', 'Brown', '222 Elm St, CityE', '555-444-7777', 'michael@email.com', '1995-07-07', 105, 5, 0.00),
    (6, 'Lisa', 'Taylor', '333 Birch St, CityF', '555-111-2222', 'lisa@email.com', '1983-12-03', 106, 6, 0.00),
    (7, 'Robert', 'Lee', '444 Cedar St, CityG', '555-777-8888', 'robert@email.com', '1992-09-25', 107, 7, 0.00),
    (8, 'Susan', 'Evans', '555 Maple St, CityH', '555-666-5555', 'susan@email.com', '1978-02-14', 108, 8, 0.00),
    (9, 'William', 'Moore', '666 Willow St, CityI', '555-222-3333', 'william@email.com', '1989-06-30', 109, 9, 0.00),
    (10, 'Karen', 'Hall', '777 Redwood St, CityJ', '555-999-1111', 'karen@email.com', '1998-04-12', 110, 10, 0.00);

--Create Plan
CREATE TABLE PhonePlan (
    PlanID SERIAL PRIMARY KEY,
    DataPlanID INT,
    plan_name VARCHAR,
    monthly_fee NUMERIC(4, 2),
    call_minutes_limit VARCHAR,
    text_message_limit VARCHAR,
    prepaid BOOLEAN
);

INSERT INTO PhonePlan(PlanID, DataPlanID, plan_name, monthly_fee, call_minutes_limit, text_message_limit, prepaid) VALUES
(101, 1, 'Data 2GB', 30, 'Unlimited', 'Unlimited', TRUE),
(102, 2, 'Data 1GB', 27.50, 'Unlimited', 'Unlimited', TRUE),
(103, 3, 'Voice 0GB', 25, '500', 'Unlimited', TRUE),
(104, 4, 'Data Unlimited', 35, 'Unlimited', 'Unlimited', TRUE),
(105, 1, 'Postpaid Data 2GB', 32.50, 'Unlimited', 'Unlimited', FALSE),
(106, 2, 'Postpaid Data 1GB', 30, 'Unlimited', 'Unlimited', FALSE), 
(107, 3, 'Postpaid Voice 0GB', 27.5, '500', 'Unlimited', FALSE),
(108, 4, 'Postpaid Unlimited Data', 37.5, 'Unlimited', 'Unlimited', FALSE),
(109, 3, '0GB Data and Limited Voice/Text', 17.5, '500', '500', TRUE),
(110, 3, '0GB Limited Text', 20, 'Unlimited', '500', TRUE);

--Create PostPaidPlan
CREATE TABLE PostPaidPlan (
    PlanID INT PRIMARY KEY,
    billing_cycle_start DATE
);

INSERT INTO PostPaidPlan(PlanID, billing_cycle_start) VALUES
(105, '2023-11-1'),
(106, '2023-11-1'),
(107, '2023-11-1'),
(108, '2023-11-1');

--Create CallRecord
CREATE TABLE CallRecord (
    CallRecordID SERIAL PRIMARY KEY,
    CustomerID INT,
    CallTypeID INT,
    call_date DATE,
    call_length_min INT,
    cost NUMERIC(4,2)
);

INSERT INTO CallRecord(CustomerID, CallTypeID, call_date, call_length_min, cost) VALUES
(1, 2, '2023-11-1', 12, 0.6),
(2, 1, '2023-11-1', 20, 1.0);

--Create CallType
CREATE TABLE CallType (
    CallTypeID SERIAL PRIMARY KEY,
    "type" VARCHAR
);

INSERT INTO CallType(CallTypeID, "type") VALUES
(1, 'Incoming'),
(2, 'Outgoing');

--Create DataUsageRecord
CREATE TABLE DataUsageRecord (
    DataRecordID SERIAL PRIMARY KEY,
    CustomerID INT,
    DataPlanID INT,
    usage_date DATE
);

--Create DataPlan
CREATE TABLE DataPlan (
    DataPlanID SERIAL PRIMARY KEY,
    data_limit VARCHAR,
    cost Numeric(4,2)
);

INSERT INTO DataPlan(DataPlanID, data_limit, cost) VALUES
(1, '2GB', 5.00),
(2, '1GB', 3.50),
(3, '0GB', 2.00),
(4, 'Unlimited', 15.00);

--Create Payment
CREATE TABLE Payment (
    PaymentID SERIAL PRIMARY KEY,
    CustomerID INT,
    PaymentTypeID INT,
    payment_date DATE,
    payment_amount NUMERIC(4,2)
);

--Create PaymentType
CREATE TABLE PaymentType (
    PaymentTypeID SERIAL PRIMARY KEY,
    payment_type VARCHAR
);

INSERT INTO PaymentType(PaymentTypeID, payment_type) VALUES
(1, 'Automatic'),
(2, 'Manual');

CREATE TABLE BankAccount (
    AccountID SERIAL PRIMARY KEY,
    "Balance" NUMERIC(12, 2),
    CustomerID INT
);

INSERT INTO BankAccount(AccountID, "Balance", CustomerID) VALUES
(1, 1000.00, 1), 
(2, 1500.00, 2), 
(3, 750.00, 3),
(4, 2000.00, 4), 
(5, 500.00, 5), 
(6, 3000.00, 6),
(7, 100.00, 7), 
(8, 2500.00, 8), 
(9, 600.00, 9),
(10, 1200.00, 10);
