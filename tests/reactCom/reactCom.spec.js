// import { TimeSharingPC } from '../../src/reactCom/pc/timeSharingPC'
import React from 'react'
import TestCom from '../../src/reactCom/testCom'

import Enzyme, { shallow, mount } from 'enzyme'
import toJson from 'enzyme-to-json'
import Adapter from 'enzyme-adapter-react-16'

import renderer from 'react-test-renderer'

const config = {
  dataGraph: {
    data: [{
      time: '0930',
      curPrice: '2993.96',
      rate: 0.6826604251999324,
      totalMoney: '2583404600',
      avPrice: '2992.6914',
      dealMount: '267890200'
    }, {
      time: '0931',
      curPrice: '2997.91',
      rate: 0.8154933650787344,
      totalMoney: '6082176700',
      avPrice: '2997.1519',
      dealMount: '589431500',
      actuallyX: 2,
      actuallyY: 79.48223145099676
    }, {
      time: '0932',
      curPrice: '2994.43',
      rate: 0.6984658636158825,
      totalMoney: '3617735600',
      avPrice: '2993.8809',
      dealMount: '320907300',
      actuallyX: 4,
      actuallyY: 88.55191586092127
    }],
    preClosePrice: '2973.66'
  },
  config: {
    insType: '0',
    theme: 'light'
  }
}

Enzyme.configure({ adapter: new Adapter() })

describe('第一个 react的ui测试 snapshot', () => {
  it('TestCom', () => {
    /* const component = renderer.create(
            <TestCom></TestCom>,
          );
          let tree = component.toJSON();
          expect(tree).toMatchSnapshot(); */
    const Wrapper = mount(<TestCom />)
    console.log(Wrapper.debug())
    console.dir(Wrapper.find('input').debug())
    // 证明存在 input 的 标签
    expect(Wrapper.find('input')).toBeTruthy()
    // 不知道为啥 snapshot 生成的 快照是 空的
    // 加了 toJson 就好了
    expect(toJson(Wrapper)).toMatchSnapshot()
  })
})
