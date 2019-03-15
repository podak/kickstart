import React, { Component } from 'react';
import factory from './../ethereum/factory';
import { Card, Button } from 'semantic-ui-react';
import Layout from './../components/Layout';
import { Link } from './../routes';

class CampaignIndex extends Component {

    constructor(){
        super();
        this.state={
            campaigns: []
        }
    }

    async componentDidMount(){
        let campaigns = await factory.methods.getDeployedCampaigns().call();
        this.setState({campaigns: campaigns});
    }

    renderCampaigns() {
        const items = this.state.campaigns.map(address => {
            return {
                header: address,
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View Campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items}></Card.Group>
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Open Campaigns</h3>

                    <Link route="campaigns/new">
                        <a>
                            <Button
                                floated="right"
                                content="Create Campaign"
                                icon="add circle"
                                primary
                            />
                        </a>
                    </Link>

                    {this.renderCampaigns()}

                </div>
            </Layout>

        );
    }

}

export default CampaignIndex;