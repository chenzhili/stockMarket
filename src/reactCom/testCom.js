import React from 'react'

function TempCom(props) {
    return (
        <div>
            {
                props.value
            }
        </div>
    );
}

class TestCom extends React.Component {
    constructor(props) {
        super();
        this.state = {
            value: ''
        }
        this.change = this.change.bind(this);
    }

    change(e) {
        this.setState({
            value:e.target.value
        });
    }
    render() {
        const { value } = this.state;
        return (
            <div>
                <h1>sdfdsd</h1>
                <input value={value} onChange={this.change} />
                <TempCom value={value} />
            </div>
        )
    }
}

export default TestCom;