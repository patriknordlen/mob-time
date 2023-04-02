# Mob time

A shared timer that plays fun, random sounds at the end.  
It has been designed as a timer for remote mob/pair programming. We wanted something
fun and easy. 

## Contribute
Fork the repo and submit a pull request !
### Setup
- You need to have npm, node, and ruby gem installed
- Install compass sass ```gem install compass```
- Download the project dependencies ```npm install```
### Run
1. Launch the server with ```npm dev```, it will start a server that restarts 
automatically on change
2. Launch in parallel ```npm bundle``` that runs browserify when a change to the
front javascript is detected
3. Launch in parallel ```compass watch``` 

## Deploy in production
- Specify the port you want the server to run on by adding a PORT environment variable
- Specify the url of the redis you want to use by adding a REDIS_URL environment variable
- Run ```npm start ```
