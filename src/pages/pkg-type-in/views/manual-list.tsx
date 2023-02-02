/** @format */
import {CellGroup, Cell, Switch} from '@nutui/nutui-react-taro'
import React from 'react'
import {View, Text} from '@tarojs/components'
import {API} from '@/src/types/index'
import {Pages, goRoute} from '@/src/utils/routes'

import styles from './manual-list.module.scss'
import {useManual} from '../stores/manual'
import {useParams} from '../stores/params'

interface Props {
    onChange?: (count: number) => void
}

function List(props: Props) {
    const data = useManual(state => state.data)
    const list = data?.gongxuList || []
    const [addId, ids] = useParams(state => [state.addId, state.ids])

    const onToggle = (item: API.TypeIn.Detail.GongxuList, bool: boolean) => {
        addId(String(item.id), bool)
        props?.onChange?.(item.totalCount - item.leave)
    }

    return (
        <View className={styles.list}>
            <CellGroup>
                {list.map((item, index) => {
                    return (
                        <Cell
                            key={item.id}
                            iconSlot={
                                <View
                                    className={styles.flag}
                                    onClick={() =>
                                        goRoute(Pages.pages_pkg_type_in_batch, {
                                            orderNum: data?.client_ordernum || '',
                                            processId: item.id,
                                        })
                                    }>
                                    批量领菲
                                </View>
                            }
                            title={`${index + 1}.${item.process_name}`}
                            linkSlot={
                                <>
                                    <Text className={styles.count}>
                                        【{item.leave}/{item.totalCount}】
                                    </Text>
                                    <Switch change={bool => onToggle(item, bool)} checked={!!ids[item.id]} />
                                </>
                            }
                        />
                    )
                })}
            </CellGroup>
        </View>
    )
}

export default React.memo(List)
