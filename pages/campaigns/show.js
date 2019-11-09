import React, { Component } from 'react';
import Layout from '../../components/Layout';
import Campaign from '../../ethereum/campaign';
import { Card, Grid, Button } from 'semantic-ui-react';
import web3 from '../../ethereum/web3';
import ContributeForm from '../../components/ContributeForm';
import { Link } from '../../routes';

class CampaignShow extends Component {
    static async getInitialProps (props)  {
        const campaign = Campaign(props.query.address)
        const summary = await campaign.methods.getSummary().call();
        return { 
            address: props.query.address,
            minimumContribution: summary[0],
            balance: summary[1],
            requestCount: summary[2],
            approversCount: summary[3],
            manager: summary[4]
        }
    }

    renderCard(){
        const {
            minimumContribution,
            balance,
            requestCount,
            approversCount,
            manager
        } = this.props;
        const items = [
                {
                    header: manager,
                    meta: 'Address of manager',
                    description: 'He created the campaign and can request to withdraw money',
                    style: { overflowWrap: 'break-word'}
                },
                {
                    header: minimumContribution,
                    meta: 'Minimum contribution (Wei)',
                    description: 'You must contribute at least this mush wei to become an approver',
                },
                {
                    header: requestCount,
                    meta: 'Number of requests',
                    description: 'A request tries to withdraw monry from the contract',
                },
                {
                    header: approversCount,
                    meta: 'Number of approvers',
                    description: 'Number of people who have already donated for this campaign',
                },
                {
                    header: web3.utils.fromWei(balance, 'ether'),
                    meta: 'Campaign balance (Ether)',
                    description: 'This balance is how much money this campaign has left to spend',
                }
        ]
        return <Card.Group items = {items} />
    }

    render() {

        return (
            <Layout>
                <h3>Campaign Show</h3>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width = { 10 }>
                            { this.renderCard() }
                        </Grid.Column>
                        <Grid.Column width = { 6 }>
                            <ContributeForm address = { this.props.address }/>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Link route = { `/campaigns/${ this.props.address }/requests` }>
                                <a>
                                    <Button primary>View Request</Button>
                                </a>
                            </Link>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Layout>
        )
            
    }
}

export default CampaignShow;