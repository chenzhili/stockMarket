import VueTest from '../../src/vueCom/VueTest.vue'
import { mount, shallowMount } from '@vue/test-utils'

describe('VueTest 组件的测试', () => {
    /* 这个 组件 只需要做的测试：
        1、初始的 快照测试；
        2、在 value 发生 变化后的  h1 的内容，或者是 快照
    */
    it('初始快照测试', () => {
        const Wrapper = shallowMount(VueTest);
        expect(Wrapper).toMatchSnapshot();
    })
    it('值修改后的快照测试', () => {
        const Wrapper = shallowMount(VueTest, {
            $data:{
                value: 'test'
            }
        });
        console.log(Wrapper.find("h1").text());
        /* 感觉这个测试 还是在 测试 vue 框架的 业务，这有点问题 */
        expect(Wrapper.find("h1").text()).toBe("初始 测试 vue 111");
    })
})