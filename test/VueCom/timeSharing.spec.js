import VueTest from '../../src/vueCom/VueTest.vue'
import { mount, shallowMount } from '@vue/test-utils'

let Wrapper;
beforeEach(() => {
    Wrapper = shallowMount(VueTest);
})
describe('简单测试 vue 的组件', () => {
    it('快照测试', () => {
        
        expect(Wrapper).toMatchSnapshot();
    })
    it('基本事件逻辑测试', () => {
        let h1Text = Wrapper.find("h1").text();
        const modifyText = Wrapper.find("input").setValue('test');
        console.log(Wrapper.find("h1").text(), Wrapper.find("input").value());
        expect(Wrapper.find("h1").text()).toBe(h1Text+modifyText)
    })
})