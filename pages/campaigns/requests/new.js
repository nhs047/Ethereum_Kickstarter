import React, { Component } from 'react';
import { Link, Router } from '../../../routes';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import Campaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';

class RequestNew extends Component{
    state = {
        value: '',
        description: '',
        receipient: '',
        loading: false,
        errMessage: ''
    }

    static async getInitialProps(props) {
        const { address } = props.query;
        return {address}
    }
    onSubmit = async(event) => {
        event.preventDefault();
        const campaign = Campaign(this.props.address);
        const { value, description, receipient } = this.state;
        this.setState({ loading: true, errMessage: '' })
        try {
            const accounts = await web3.eth.getAccounts();
            await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), receipient).send({
                from: accounts[0]
            });
            Router.pushRoute(`/campaigns/${ this.props.address }/requests`);
        } catch (err) {
            this.setState({ errMessage: err.message });
        }
        this.setState({ loading: false, value: '', description: '', receipient: '' })
    }
    render(){
        return (
            <Layout>
                <Link route = {`/campaigns/${ this.props.address }/requests`}>
                    <a>Back</a>
                </Link>
                <h3> Create a request </h3>
                <Form onSubmit = { this.onSubmit } error = { !!this.state.errMessage } >
                    <Form.Field>
                        <label> Description </label>
                        <Input value = { this.state.description } onChange = { event => {
                            this.setState({ description: event.target.value })
                        }} />
                    </Form.Field>
                    <Form.Field>
                        <label> Value in ether </label>
                        <Input value = { this.state.value } onChange = { event => {
                            this.setState({ value: event.target.value })
                        }}/>
                    </Form.Field>
                    <Form.Field>
                        <label> Receipient </label>
                        <Input value = { this.state.receipient } onChange = { event => {
                            this.setState({ receipient: event.target.value })
                        }}/>
                    </Form.Field>
                    <Message error header = {'Oops'} content = { this.state.errMessage } />
                    <Button loading = { this.state.loading } primary>Create!</Button>
                </Form>
            </Layout>
        );
    }
}

export default RequestNew;