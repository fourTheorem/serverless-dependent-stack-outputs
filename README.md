# serverless-dependent-stack-outputs

A Serverless Framework plugin to set environment variables from exports of AWS CloudFormation stacks in other regions.

## Why?

CloudFormation's [ImportValue](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference-importvalue.html) function allows you to use stack outputs as inputs to resources. This only works for stacks in the same region, however. This plugin allows you to specify stacks in other regions. It will populate your provider environment variables with the named, exported values of those stacks' outputs.

## Getting Starter

1. Install the plugin in your Serverless project.

```
npm install --save serverless-dependent-stack-outputs
```

2. Add the plugin in your Serverless configuration file (Usually `serverless.yml`).

```yml
plugins:
  - serverless-dependent-stack-outputs
```

3. Configure the regions and stacks to pull outputs from.

```
dependentStacks:
  stacks:
    - region: eu-west-1
      name: slic-starter-backend-prod
		- region: us-east-1
			name: slic-starter-registration-prod
```

The output of `serverless package` or `serverless deploy` will show the exports that have been found and added to your provider environment variables. Export names are converted to snake case and are all upper case.

4. Use the environment variables in your Lambda functions.


## LICENSE

See [LICENCE](LICENCE)

Copyright fourTheorem Ltd. 2019
