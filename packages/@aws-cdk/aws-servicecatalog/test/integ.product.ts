import * as path from 'path';
import * as sns from '@aws-cdk/aws-sns';
import * as cdk from '@aws-cdk/core';
import * as servicecatalog from '../lib';

const app = new cdk.App();
const stack = new cdk.Stack(app, 'integ-servicecatalog-product');

class TestProductStack extends servicecatalog.ProductStack {
  constructor(scope: any, id: string) {
    super(scope, id);

    new sns.Topic(this, 'TopicProduct');
  }
}

new servicecatalog.CloudFormationProduct(stack, 'TestProduct', {
  productName: 'testProduct',
  owner: 'testOwner',
  productVersions: [
    {
      validateTemplate: false,
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromUrl(
        'https://awsdocs.s3.amazonaws.com/servicecatalog/development-environment.template'),
    },
    {
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product1.template.json')),
    },
    {
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromAsset(path.join(__dirname, 'product2.template.json')),
    },
    {
      cloudFormationTemplate: servicecatalog.CloudFormationTemplate.fromStack(new TestProductStack(stack, 'SNSTopicProduct')),
    },
  ],
});

app.synth();
