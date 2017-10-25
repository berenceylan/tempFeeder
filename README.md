# tempFeeder
Web UI of real-time temperature tracking project with a raspberry pi. I am simply using it so that i keep track of my beer brewing bucket's temperature in real-time from anywhere. Brewing a wheat beer can be tricky sometimes :) Fingers crossed for a weihenstephaner clone :)

## Contains 3 parts;

### 1- Node.Js

Node part is listening a socket in order to update charts in real-time. 

#### To-Do

I will update node.js parts to get rid of polling method. 

### 2- Raspberry PI 

I have a cron working on raspberry. It works once a minute and sends temperature data to my mySQL database.

#### To-Do

I will separate inner config variables from the code to make it more flexible and configurable such as,
* Db credentials (link, port, username, password)
* Cron working interval

Also it will be sending the temperature data to multiple databases in the future.

### 3- Database

Straight forward mySQL database to keep temperature data.



