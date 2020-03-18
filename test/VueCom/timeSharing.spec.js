import VueTest from '../../src/vueCom/VueTest.vue'
import { mount, shallowMount } from '@vue/test-utils'

let Wrapper;
beforeEach(() => {
    Wrapper = shallowMount(VueTest);
})
describe('简单测试 vue 的组件', () => {
    it('快照测试', () => {
        console.log(Wrapper.find("input").text());
        expect(Wrapper).toMatchSnapshot();
    })
    it('基本事件逻辑测试', () => {

    })
})