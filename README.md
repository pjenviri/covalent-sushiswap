# Covalent - SushiSwap Dashboard
An analytics dashboard presents SushiSwap DEX information. You can see SushiSwap's updated information, including liquidity, swap, other granular and historical data, etc.

<img width="1440" alt="Covalent - SushiSwap Dashboard" src="https://user-images.githubusercontent.com/87146398/125054269-3c096480-e0d0-11eb-9a60-62c0b748ccfd.png">

## Dashboard URL
[https://sushiswap.coinhippo.io](https://sushiswap.coinhippo.io)

## Data provider / APIs
All data presented on the dashboard are retrieved from [Covalent's Uniswap Clone Endpoints](https://www.covalenthq.com/docs/learn/guides/uniswap-clone).

## Technology stacks
This project is built as a serverless system, getting inspiration from the [Covalent AWS Serverless](https://github.com/nrsirapop/covalent-aws-serverless) project.

The technologies used include
- [React.js](https://reactjs.org) is used for building the user interface of the dashboard.
- [Covalent AWS Serverless](https://github.com/nrsirapop/covalent-aws-serverless) is used as a bridge of requesting data from Covalent's endpoints with our serverless setup.
- [AWS Lambda](https://aws.amazon.com/lambda) is used for setting up a lambda function to retrieve the data from [Covalent API](https://www.covalenthq.com/docs/api/).
- [AWS S3](https://aws.amazon.com/s3) service is used for hosting the dashboard as a static website.

The setup instructions can be found in the [README.md](https://github.com/nrsirapop/covalent-aws-serverless#readme) of the Covalent AWS Serverless project

### Note
The project is built as a part of the [coinhippo.io](https://coinhippo.io) website.
