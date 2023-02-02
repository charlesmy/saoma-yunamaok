/** @format */
import {runComponent, CloseFunc, Result} from '@/src/utils/run-component'
import {View, ScrollView, Image, CommonEventFunction, Checkbox, CheckboxGroup} from '@tarojs/components'
import {useRef} from 'react'
import styles from './show-filter.module.scss'

interface Props {
    _onClose?: CloseFunc<string[]>
    sizeList: string[]
}

function Filter(props: Props) {
    const onDestroy = (res: Result<string[]>) => {
        if (typeof props._onClose === 'function') {
            props._onClose(res)
        }
    }

    const onClose = () => {
        onDestroy({code: -1, message: '关闭弹窗'})
    }

    const select = useRef<string[]>([])
    const list = props.sizeList || []
    const sizeArr = [...new Set(list)]

    const onChange: CommonEventFunction<{
        value: string[]
    }> = e => {
        select.current = e.detail.value
    }

    const onConfirm = () => {
        onDestroy({code: 0, message: '', data: select.current})
    }

    return (
        <View className="ba__dialog__mask">
            <View className={styles.container}>
                <View className={styles.head}>尺寸筛选</View>
                <View className={styles.confirm} onClick={onConfirm}>
                    确定
                </View>
                <ScrollView scrollY className={styles.list}>
                    <CheckboxGroup onChange={onChange}>
                        {sizeArr.map(size => (
                            <View className={styles.line} key={size}>
                                <View className={styles.middle}>{size}</View>
                                <View className={styles.count}>
                                    <Checkbox value={size} />
                                </View>
                            </View>
                        ))}
                    </CheckboxGroup>
                </ScrollView>
                <Image
                    src={require('@/src/images/icon_close.png')}
                    mode="aspectFit"
                    className={styles.close}
                    onClick={onClose}
                />
            </View>
        </View>
    )
}

export default Filter

export const showFilter = (props: Props) => {
    return runComponent<string[]>(Filter, props)
}
