 
## Set up ##

```

git submodule update --remote --merge

testrpc --mnemonic "my test example" --accounts 50

cd ~/insurance/insurance_contractDeployer
npm run start

cd ../insurance_oracle 
npm run start


```