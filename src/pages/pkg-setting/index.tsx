/** @format */

import {View, Input, Text} from '@tarojs/components'
import {useEffect, useState} from 'react'
import {CellGroup, Cell, Switch} from '@nutui/nutui-react-taro'
import shallow from 'zustand/shallow'
import Taro, {useUnload} from '@tarojs/taro'
import {API} from '@/src/types/index'
import useLockFn from '@/src/utils/hooks/useLockFn'
import {isNull} from '@/src/utils/index'
import {useUser} from '@/src/stores/user'

import styles from './index.module.scss'
import {useSetting} from './stores/index'
import {postSetting} from './api/index'

function Index() {
    const [data, onLoad, clear] = useSetting(state => [state.data, state.onLoad, state.clear], shallow)
    const [num, setNum] = useState('')
    const getUser = useUser(state => state.getUser)

    useEffect(() => {
        const load = async () => {
            const res = await onLoad()
            if (res.code !== 0) {
                Taro.showToast({icon: 'none', title: res.message})
            }
        }
        load()
        return () => {
            clear()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useUnload(() => {
        getUser(false)
    })

    const onChange = useLockFn(async (value: boolean, type: string) => {
        // Taro.showLoading({title: '加载中'})
        const params: Partial<API.Setting.Setup.Params> = {}
        switch (type) {
            case 'remeber_process_bool':
                params.remeber_process_bool = value ? 1 : 0
                break
            case 'bind_process_commit_bool':
                params.bind_process_commit_bool = value ? 1 : 0
                break
            case 'batch_scan_bool':
                params.batch_scan_bool = value ? 1 : 0
                break
            case 'close_quality_bool':
                params.close_quality_bool = value ? 1 : 0
                params.quality_num = isNull(num) ? data?.quality_num : Number(num)
                break
            case 'fix_bool':
                params.fix_bool = value ? 1 : 0
                break
            case 'bad_bool':
                params.bad_bool = value ? 1 : 0
                break
            case 'salary_bool':
                params.salary_bool = value ? 1 : 0
                break
        }
        const res = await postSetting(params)
        // Taro.hideLoading()
        if (res.code !== 0) {
            Taro.showToast({icon: 'none', title: res.message})
        }
    })

    return (
        <View className={styles.page}>
            <CellGroup>
                <Cell
                    title="记住上次工序选择"
                    linkSlot={
                        <Switch
                            checked={data?.remeber_process_bool === 1}
                            change={value => onChange(value, 'remeber_process_bool')}
                        />
                    }
                />
                <Cell
                    title="绑定工序后，扫菲后自动提交"
                    linkSlot={
                        <Switch
                            checked={data?.bind_process_commit_bool === 1}
                            change={value => onChange(value, 'bind_process_commit_bool')}
                        />
                    }
                />
                <Cell
                    title="开启批量领菲"
                    linkSlot={
                        <Switch
                            checked={data?.batch_scan_bool === 1}
                            change={value => onChange(value, 'batch_scan_bool')}
                        />
                    }
                />
                <Cell
                    title="关闭品质默认录入数量"
                    linkSlot={
                        <View className={styles.cellCount}>
                            <Input
                                onInput={e => setNum(e.detail.value)}
                                type="number"
                                value={(data?.quality_num || 0) + ''}
                            />
                            <Switch
                                checked={data?.close_quality_bool === 1}
                                change={value => onChange(value, 'close_quality_bool')}
                            />
                        </View>
                    }
                />
                <Cell
                    title="品质默认录入疵品类型"
                    linkSlot={
                        <View className={styles.cellType}>
                            <Switch checked={data?.fix_bool === 1} change={value => onChange(value, 'fix_bool')} />
                            <Text className={styles.canuse}>可返修</Text>
                            <Switch checked={data?.bad_bool === 1} change={value => onChange(value, 'bad_bool')} />
                            <Text className={styles.cannotuse}>疵品</Text>
                        </View>
                    }
                />
                <Cell
                    title="工资详情设为首页"
                    linkSlot={
                        <Switch checked={data?.salary_bool === 1} change={value => onChange(value, 'salary_bool')} />
                    }
                />
            </CellGroup>
        </View>
    )
}

export default Index
