import React, {Component} from 'react';
import Layout from '../../../components/Layout';
import { Link } from '../../../routes';
import { Button, Table } from 'semantic-ui-react';
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component{
    static async getInitialProps(props) {
        const { address } = props.query;
        const campaign = Campaign(address);
        const requestCount = await campaign.methods.getRequestsCount().call();
        const approversCount = await campaign.methods.approversCount().call();
                
        const requests = await Promise.all(
            Array(parseInt(requestCount)).fill().map((element, index) => {
                return campaign.methods.requests(index).call();
            })
        );
        
        return { address, requests, requestCount, approversCount };

    }


    requestRow() {
        return this.props.requests.map((request, index) => {
            return <RequestRow 
                key = { index } 
                id = {index} 
                request = { request } 
                approversCount = { this.props.approversCount } 
                address = {this.props.address} />
        })
    }

    render() {
        const {Header, Row, HeaderCell, Body} = Table;

        return (
            <Layout>
                <h3>Request</h3>
                <Link route = { `/campaigns/${ this.props.address }/requests/new` }>
                    <a>
                        <Button primary>Request</Button>
                    </a>
                </Link>
                <Table>
                    <Header>
                        <Row>
                            <HeaderCell>ID</HeaderCell>
                            <HeaderCell>Description</HeaderCell>
                            <HeaderCell>Amount</HeaderCell>
                            <HeaderCell>Recipient</HeaderCell>
                            <HeaderCell>Approval Count</HeaderCell>
                            <HeaderCell>Approve</HeaderCell>
                            <HeaderCell>Finalize</HeaderCell>
                        </Row>
                    </Header>
                    <Body>
                        { this.requestRow() }
                    </Body>
                </Table>
                <div>{`Found ${this.props.requestCount} Request`}</div>
            </Layout>
        )
    }
}

export default RequestIndex;