// import { TimeSharingPC } from '../../src/reactCom/pc/timeSharingPC'
import TestCom from '../../src/reactCom/test'
import React,{ Component } from 'react'
import Enzyme,{ shallow } from 'enzyme'
// import Adapter from 'enzyme-adapter-react-15';

beforeAll(() => {
    return Enzyme.configure({ adapter: new Adapter() });
})


describe('第一个 react的ui测试 snapshot', () => {
    console.log(shallow);
    const config = {
        dataGraph: {
            data: [{
                "time": "0930",
                "curPrice": "2993.96",
                "rate": 0.6826604251999324,
                "totalMoney": "2583404600",
                "avPrice": "2992.6914",
                "dealMount": "267890200"
            }, {
                "time": "0931",
                "curPrice": "2997.91",
                "rate": 0.8154933650787344,
                "totalMoney": "6082176700",
                "avPrice": "2997.1519",
                "dealMount": "589431500",
                "actuallyX": 2,
                "actuallyY": 79.48223145099676
            }, {
                "time": "0932",
                "curPrice": "2994.43",
                "rate": 0.6984658636158825,
                "totalMoney": "3617735600",
                "avPrice": "2993.8809",
                "dealMount": "320907300",
                "actuallyX": 4,
                "actuallyY": 88.55191586092127
            }],
            preClosePrice: '2973.66'
        },
        config: {
            insType: '0',
            theme: 'light'
        }
    }
    const com = shallow(<TestCom/>)
    test('TestCom',()=>{
        expect(com).toMatchSnapshot()
    })
})