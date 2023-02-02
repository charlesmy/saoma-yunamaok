/** @format */

import {View, Picker, Input, Textarea, Button} from '@tarojs/components'
import Taro, {useRouter, useReady} from '@tarojs/taro'
import classNames from 'classnames'
import {useEffect, useMemo} from 'react'
import {Icon} from '@nutui/nutui-react-taro'
import {RoleList} from '@/src/features/role-list/index'
import {uploadFile} from '@/src/network/upload'
import useLockFn from '@/src/utils/hooks/useLockFn'
import {useRoleList} from '@/src/stores/role-list'
import {API} from '@/src/types/index'
import {isNull} from '@/src/utils/index'

import styles from './new.module.scss'
import BaseItem from './components/base-item'
import {useMsgEdit} from './stores/edit'
import {addMsg, getMsgDesc, editMsg} from './api/index'

const MsgType = ['选择', '内部消息', '系统消息']
const MsgPositon = ['选择', '广告位', '消息提醒']

// interface Query {
//     id?: string
// }

function NewMessage() {
    const msgStore = useMsgEdit()
    const loadRoleList = useRoleList(state => state.onLoad)
    const roleList = useRoleList(state => state.data)
    // 有id则是编辑
    const id = useRouter().params.id

    useReady(() => {
        Taro.setNavigationBarTitle({title: isNull(id) ? '新建消息' : '编辑消息'})
    })

    useEffect(() => {
        loadRoleList()
        if (!isNull(id)) {
            getMsgDesc({id: Number(id)}).then(res => {
                if (res.code === 0) {
                    msgStore.setValue({...res.data})
                } else {
                    Taro.showToast({icon: 'none', title: res.message})
                }
            })
        }
        return () => {
            msgStore.clear()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onSelectMsgType = () => {
        Taro.showActionSheet({
            itemList: MsgType.slice(1),
            success(res) {
                msgStore.setValue({type: res.tapIndex + 1})
            },
        })
    }
    const onSelectMsgPosition = () => {
        Taro.showActionSheet({
            itemList: MsgPositon.slice(1),
            success(res) {
                msgStore.setValue({location: res.tapIndex + 1})
            },
        })
    }

    const chooseMedia = () => {
        return new Promise<Taro.chooseMedia.SuccessCallbackResult | null>(resolve => {
            Taro.chooseMedia({
                count: 1,
                mediaType: ['image', 'video'],
                sourceType: ['album', 'camera'],
                camera: 'back',
                success: res => {
                    resolve(res)
                },
                fail() {
                    resolve(null)
                },
            })
        })
    }

    const chooseFile = useLockFn(async () => {
        const file = await chooseMedia()
        if (!file) return
        const res = await uploadFile(file.tempFiles[0].tempFilePath)
        if (res?.code === 0) {
            msgStore.setValue({img: res.data.file})
        } else {
            Taro.showToast({icon: 'none', title: res?.message || '上传失败'})
        }
    })

    const onRoleSelect = (value: API.Message.RoleList.Data) => {
        if (value) {
            const cur = (msgStore.roles || '').split(',')
            msgStore.setValue({roles: [...cur, value.id].join(',')})
        }
    }

    const onSubmit = async () => {
        let msg = ''
        if (msgStore.type <= 0) {
            msg = '请先选择消息类型'
        } else if (isNull(msgStore.title)) {
            msg = '请先填写消息标题'
        } else if (isNull(msgStore.content)) {
            msg = '请先填写消息内容'
        } else if (!msgStore.roles) {
            msg = '请先选择执行对象'
        } else if (msgStore.location <= 0) {
            msg = '请先选择显示位置'
        }
        if (msg) {
            Taro.showToast({icon: 'none', title: msg})
            return
        }

        const params = {
            type: msgStore.type,
            start_time: msgStore.start_time,
            end_time: msgStore.end_time,
            title: msgStore.title,
            content: msgStore.content,
            img: msgStore.img,
            roles: msgStore.roles,
            location: msgStore.location,
        }
        let res: API.Message.Add.Response
        if (!isNull(id)) {
            params['id'] = Number(id)
            res = await editMsg(params as API.Message.Edit.Params)
        } else {
            res = await addMsg(params)
        }
        if (res && res.code === 0) {
            Taro.showToast({icon: 'none', title: '操作成功'})
            Taro.eventCenter.trigger('__msgListUpdate__')
            Taro.navigateBack()
            return
        }
        if (res && res.message) {
            Taro.showToast({icon: 'none', title: res.message})
        }
    }

    const msgType = MsgType[msgStore.type || 0]
    const msgPosition = MsgPositon[msgStore.location || 0]

    const roleNames = useMemo(() => {
        const cur = (msgStore.roles || '').split(',')
        const names: string[] = []
        roleList.forEach(item => {
            if (cur.includes(String(item.id))) {
                names.push(item.name)
            }
        })
        return names.length > 0 ? names.join(',') : ''
    }, [msgStore.roles, roleList])

    return (
        <View className={styles.page}>
            <BaseItem
                label="消息类型"
                required
                rightReactNode={
                    <View className={styles.select} onClick={onSelectMsgType}>
                        {msgType}
                    </View>
                }
            />
            <BaseItem
                label="开始时间"
                rightReactNode={
                    <View className={styles.select}>
                        <Picker
                            mode="date"
                            value={msgStore.start_time}
                            onChange={e => msgStore.setValue({start_time: e.detail.value})}>
                            {msgStore.start_time || '选择开始日期'}
                        </Picker>
                    </View>
                }
            />
            <BaseItem
                label="结束时间"
                rightReactNode={
                    <View className={styles.select}>
                        <Picker
                            mode="date"
                            value={msgStore.end_time}
                            onChange={e => msgStore.setValue({end_time: e.detail.value})}>
                            {msgStore.end_time || '选择结束日期'}
                        </Picker>
                    </View>
                }
            />
            <BaseItem
                label="消息标题"
                required
                rightReactNode={
                    <View className={styles.select}>
                        <Input
                            value={msgStore.title}
                            className={styles.input}
                            placeholder="输入标题"
                            onInput={e => msgStore.setValue({title: e.detail.value})}
                        />
                    </View>
                }
            />
            <BaseItem
                label="消息内容"
                required
                className={styles.textareaItem}
                rightReactNode={
                    <Textarea
                        className={styles.textarea}
                        placeholder="输入内容"
                        value={msgStore.content}
                        onInput={e => msgStore.setValue({content: e.detail.value})}
                    />
                }
            />

            <BaseItem
                label="选择附件(图片、视频或者文件)"
                rightReactNode={
                    <View className={styles.select} onClick={chooseFile}>
                        {msgStore.img || '上传'}
                    </View>
                }
            />

            <BaseItem
                label="执行对象"
                required
                rightReactNode={
                    <View className={classNames(styles.select, styles.oneLine)}>
                        <Input
                            disabled
                            className={classNames(styles.input, styles.oneHalf)}
                            placeholder="员工、QC、车间组长、尾部组长、厂长"
                            value={roleNames}
                        />
                        <RoleList onChange={onRoleSelect}>
                            <Icon
                                fontClassName={classNames('iconfont-v2', styles.roleSelect)}
                                classPrefix="icon"
                                name="yuangong"
                                size="26px"
                            />
                        </RoleList>
                    </View>
                }
            />

            <BaseItem
                label="显示位置"
                required
                rightReactNode={
                    <View className={styles.select} onClick={onSelectMsgPosition}>
                        {msgPosition}
                    </View>
                }
            />

            <View className={styles.footer}>
                <Button className={classNames(styles.btn, styles.btnDel)} onClick={() => Taro.navigateBack()}>
                    返回
                </Button>
                <Button className={classNames(styles.btn, styles.btnConfirm)} onClick={onSubmit}>
                    提交
                </Button>
            </View>
        </View>
    )
}

export default NewMessage
