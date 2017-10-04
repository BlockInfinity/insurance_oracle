 
## Set up ##

testrpc --mnemonic "my test example" --accounts 50

cd ~/insurance/insurance_contractDeployer
gulp run 

cd ../oracle 
gulp run 
