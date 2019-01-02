'use strict'

const { snakeCase } = require('change-case')
const BbPromise = require('bluebird')

function ServerlessPlugin(serverless, options) {
  this.serverless = serverless
  this.options = options
  this.hooks = {
    'after:package:initialize': processExports.bind(this)
  }
}

function processExports() {
  const provider = this.serverless.getProvider('aws')
  if (!provider) {
    throw new Error('This plugin requires an AWS provider')
  }
  const dependentStacks = this.serverless.service.custom.dependentStacks
  if (dependentStacks) {
    const { credentials } = provider.getCredentials()
    dependentStacks.exports = {}

    let environment = this.serverless.service.provider.environment
    if (!environment) {
      environment = {}
      this.serverless.service.provider.environment = environment
    }

    return BbPromise.each(dependentStacks.stacks || [], ({ region, name }) => {
      this.serverless.cli.log(
        `Finding outputs in dependent stack ${region}:${name}`
      )
      const cf = new provider.sdk.CloudFormation({ credentials, region })

      return cf
        .describeStacks({ StackName: name })
        .promise()
        .then(data => {
          if (data.Stacks) {
            data.Stacks.forEach(({ Outputs: outputs }) => {
              outputs
                .filter(output => !!output.ExportName)
                .forEach(
                  ({
                    OutputKey: key,
                    OutputValue: value,
                    ExportName: exportName
                  }) => {
                    const envName = snakeCase(exportName).toUpperCase()
                    this.serverless.cli.log(
                      `Adding environment variable to provider - ${envName} = ${value}`
                    )
                    environment[envName] = value
                  }
                )
            })
          }
        })
    })
  }
}

module.exports = ServerlessPlugin
