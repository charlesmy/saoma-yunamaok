/** @format */
import {View, Button} from '@tarojs/components'
import Tab, {TabOption} from '@/src/components/tabs/tab'
import classNames from 'classnames'
import {useEffect} from 'react'
import Taro, {useReachBottom} from '@tarojs/taro'
import {Icon} from '@nutui/nutui-react-taro'
import {API} from '@/src/types/index'
import {goRoute, Pages} from '@/src/utils/routes'
import useLockFn from '@/src/utils/hooks/useLockFn'
import {useMsgCount} from '@/src/stores/msg-count'

import styles from './index.module.scss'
import MessageItem from './components/message-item'
import {useList} from './stores/list'
import {delMsg, publicMsg} from './api/index'

function Index() {
    const listStore = useList()
    const msgCount = useMsgCount()

    const tabs: TabOption[] = [
        {name: '内部消息', index: 0, value: 1, count: msgCount.data?.neibu || 0},
        {name: '系统消息', index: 1, value: 2, count: msgCount.data?.system || 0},
    ]

    useEffect(() => {
        msgCount.onLoad()
        listStore.onPullDown()
        return () => {
            listStore.clear()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        Taro.eventCenter.on('__msgListUpdate__', () => {
            listStore.onPullDown()
        })
        return () => {
            Taro.eventCenter.off('__msgListUpdate__')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useReachBottom(() => {
        if (listStore.isDone) return
        listStore.onPullUp()
    })

    const onTabChange = (item: TabOption) => {
        if (item.value === listStore.params.type) return
        listStore.setParams({type: item.value})
        listStore.onPullDown()
    }

    const onSelect = (item: API.Message.List.Item) => {
        listStore.setSelectItem(item.id === listStore.selectItem?.id ? null : item)
    }

    const onDel = useLockFn(async () => {
        if (!listStore.selectItem) {
            Taro.showToast({icon: 'none', title: '请先选择一个消息'})
            return
        }
        const res = await delMsg({id: listStore.selectItem.id})
        if (res.code === 0) {
            listStore.delItem(listStore.selectItem.id)
            listStore.setSelectItem(null)
            Taro.showToast({icon: 'none', title: '删除成功'})
        } else {
            Taro.showToast({icon: 'none', title: res.message})
        }
    })

    const onPublic = useLockFn(async () => {
        if (!listStore.selectItem) {
            Taro.showToast({icon: 'none', title: '请先选择一个消息'})
            return
        }
        const res = await publicMsg({id: listStore.selectItem.id})
        if (res.code === 0) {
            listStore.updateItem(listStore.selectItem)
            listStore.setSelectItem(null)
            Taro.showToast({icon: 'none', title: '发布成功'})
        } else {
            Taro.showToast({icon: 'none', title: res.message})
        }
    })

    const onEdit = () => {
        if (!listStore.selectItem) {
            Taro.showToast({icon: 'none', title: '请先选择一个消息'})
            return
        }
        goRoute(Pages.pages_pkg_message_new, {id: listStore.selectItem.id})
    }

    const tips =
        listStore.isPullingDown || listStore.isPullingUp
            ? '加载中'
            : listStore.isDone
            ? '没有更多了'
            : listStore.isError
            ? '出错了'
            : ''
    // 已发布的禁止发布和修改
    const disabled = !listStore.selectItem || listStore.selectItem.status === 2

    return (
        <View className={styles.page}>
            <Tab tabs={tabs} onChange={onTabChange}></Tab>
            <View className={styles.list}>
                {listStore.list.map(item => (
                    <MessageItem key={item.id} item={item} selectId={listStore.selectItem?.id} onSelect={onSelect} />
                ))}
            </View>
            <View className={styles.tips}>{tips}</View>
            <View className={styles.footer}>
                <Button className={classNames(styles.btn, styles.btnConfirm)} disabled={disabled} onClick={onPublic}>
                    发布
                </Button>
                <Button className={classNames(styles.btn, styles.btnScan)} disabled={disabled} onClick={onEdit}>
                    编辑
                </Button>
                <Button
                    className={classNames(styles.btn, styles.btnDel)}
                    onClick={onDel}
                    disabled={!listStore.selectItem}>
                    删除
                </Button>
            </View>
            <View className={styles.add} onClick={() => goRoute(Pages.pages_pkg_message_new)}>
                <Icon
                    className={styles.addIcon}
                    fontClassName="iconfont-v2"
                    classPrefix="icon"
                    name="wendangbianji"
                    size="24px"
                />
            </View>
        </View>
    )
}

export default Index
