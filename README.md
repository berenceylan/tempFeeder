# tempFeeder
Web UI of real-time temperature tracking project with a raspberry pi. I am simply using it so that i keep track of my beer brewing bucket's temperature in real-time from anywhere. Brewing a wheat beer can be tricky sometimes :) Fingers crossed for a weihenstephaner clone :)

[Live demo](http://95.85.28.239:3001)

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


## Web UI To-Do
* New brewings can be added via interface. (Starting date, bottling date, prime sugar amount, yeast type, water density et cetera.)
* All past brewings can be monitored on a new page. It can be selected via dropdown menu. Bucket and bottle phases can be seen separately.
* All the expenses can be recorded to the database to calculate price per bottle.
* A mini resource planning system will be added to the ui to keep track of the supplies.

Thanks for checking out my weekend project :) hope you enjoy it.

```
When beer is brewed all is well,
When beer is drunk life is good.
```
