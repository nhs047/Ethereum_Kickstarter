import React, { Component } from 'react';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';
import Campaign from '../ethereum/campaign';
import { Router } from '../routes';

class RequestRow extends Component {
    state = {
        loadingApproval: false,
        loadingFinalize: false
    }
    
    onApprove = async event => {
        event.preventDefault;
        this.setState({ loadingApproval: true });
        try{
            const accounts = await web3.eth.getAccounts();   
            const campaign = new Campaign(this.props.address);
            const requestCount = await campaign.methods.getRequestsCount().call();
            await campaign.methods.approveRequest(this.props.id).send({
                from: accounts[0]
            });
            Router.pushRoute(`/campaigns/${ this.props.address }/requests`);
        }
        catch(err){

        }
        this.setState({ loadingApproval: false });
    }

    onFinalize = async event => {
        event.preventDefault;
        this.setState({ loadingFinalize: true });
        try{
            const accounts = await web3.eth.getAccounts();   
            const campaign = new Campaign(this.props.address);
            const requestCount = await campaign.methods.getRequestsCount().call();
            await campaign.methods.finalizeRequest(this.props.id).send({
                from: accounts[0]
            });
            Router.pushRoute(`/campaigns/${ this.props.address }/requests`);            
        }
        catch(err) {

        }
        this.setState({ loadingFinalize: false });
    }

    render() {
        const { Row, Cell } = Table;
        const { id, request, approversCount } = this.props;
        const readyToFinalize = request.approvalCount > approversCount;
        return <Row disabled = { request.complete } positive = { readyToFinalize && !request.complete }>
                <Cell>
                    { id+1 }
                </Cell>
                <Cell>
                    { request.description }
                </Cell>
                <Cell>
                    { web3.utils.fromWei(`${request.value}`, 'ether') }
                </Cell>
                <Cell>
                    { request.recipient }
                </Cell>
                <Cell>
                    { `${ request.approvalCount }/${ approversCount }` }
                </Cell>
                <Cell>
                    { request.complete ? null : (
                        <Button loading = { this.state.loadingApproval } color = { 'green' } onClick = { this.onApprove } basic> Approve! </Button>
                    )}
                     
                </Cell>
                <Cell>
                { request.complete ? null : (
                       <Button loading = { this.state.loadingFinalize } color = { 'teal' } onClick = {this.onFinalize} basic> Finalize! </Button>
                    )}
                     
                </Cell>
                
            </Row>
    }
}

export default RequestRow;