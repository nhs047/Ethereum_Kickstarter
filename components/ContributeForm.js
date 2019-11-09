import React, { Component } from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import Campaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';
import { Router } from '../routes';


class ContributeForm extends Component{
    state = {
        value: '',
        loading: false,
        errMessage: ''
    }

    onSubmit = async event => {
        event.preventDefault();
        const campaign = Campaign(this.props.address)
        this.setState({ loading: true, errMessage: '' });
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.contribute().send({
                from: accounts[0],
                value: web3.utils.toWei(this.state.value, 'ether')
            });
            Router.pushRoute(`/campaigns/${ this.props.address }`);
        } catch (err) {
            console.log(err);
            
            this.setState({ errMessage: err.message });
        }
        this.setState({ loading: false, value: '' })
    }
    render() {
        return (
            <Form onSubmit = {this.onSubmit} error = { !!this.state.errMessage }>
                <Form.Field>
                    <label>Amount of Contrition</label>
                    <Input 
                        label = 'Ether' 
                        labelPosition = 'right'
                        onChange = { event => this.setState({ value: event.target.value })}
                    />
                </Form.Field>
                <Message error header = 'Oops' content = {this.state.errMessage } />
                <Button loading = { this.state.loading } primary>Contribute</Button>
            </Form>
        );
    }
}

export default ContributeForm;