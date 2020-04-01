// import VueTest from '../../src/vueCom/VueTest.vue'
// import { mount, shallowMount } from '@vue/test-utils'

// describe('VueTest 组件的测试', () => {
//     /* 这个 组件 只需要做的测试：
//         1、初始的 快照测试；
//         2、在 value 发生 变化后的  h1 的内容，或者是 快照
//     */
//     it('初始快照测试', () => {
//         const Wrapper = shallowMount(VueTest);
//         expect(Wrapper).toMatchSnapshot();
//     })
//     it('值修改后的快照测试', () => {
//         const Wrapper = shallowMount(VueTest, {
//             $data:{
//                 value: 'test'
//             }
//         });
//         console.log(Wrapper.find("h1").text());
//         /* 感觉这个测试 还是在 测试 vue 框架的 业务，这有点问题 */
//         expect(Wrapper.find("h1").text()).toBe("初始 测试 vue 111");
//     })
// })

import { shallowMount, mount, createLocalVue } from '@vue/test-utils'
import VueTest from '../../src/vueCom/VueTest.vue'
// import threeOrder from '@/pages/threeOrder/index.vue'
// import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
// import uniStatusBar from '@/components/uni-status-bar/uni-status-bar.vue'

// let localVue = createLocalVue();
// const post = jest.fn((data) => Promise.resolve(data));
const creatConfig = (overrides) => {
    const mocks = {
        // Vue Router
        //   $router: {
        //     push: () => { }
        //   },
        // Vuex
        //   $store: {
        //     state: { list: [{ id: "2", title: "mock-test" }] },
        //     commit: () => { }
        //   }
        $http: {
            post: (data) => {
                return Promise.resolve(data)
            }
        }
    };

    const propsData = {};
    return Object.assign({ mocks, propsData }, overrides);
}



describe('简单测试', () => {
    it('1+1', async () => {
        const config = creatConfig({
            $http: {
                post: (data) => {
                    return Promise.resolve(data)
                }
            }
        })
        console.log(config);

        let wrapper = shallowMount(VueTest, {
            ...config
        })
        console.log(wrapper.vm.$http);
        const data = await wrapper.vm.$http.post({ test: 1 });
        console.log(data);

        expect(data).toEqual({test:1})



        // expect(1).toBe(1)

        // debugger
        // wrapper.setData({ entrustPrice: '1.23' })
        // debugger
        //  let dom1=wrapper.find('.text3')
        //  dom1.trigger('click')
        // let num=1
        // num+=1
        // expect(num).toBe(2)
    })
})