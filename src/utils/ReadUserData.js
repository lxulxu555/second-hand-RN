export class readUser {
    static _readData() {
        return new Promise((resolve, reject) => {
            storage.load({
                key: 'loginState',
                // autoSync(默认为true)意味着在没有找到数据或数据过期时自动调用相应的sync方法
                autoSync: true,

                // syncInBackground(默认为true)意味着如果数据过期，
                // 在调用sync方法的同时先返回已经过期的数据。
                // 设置为false的话，则等待sync方法提供的最新数据(当然会需要更多时间)。
                syncInBackground: true,

                // 你还可以给sync方法传递额外的参数
                syncParams: {
                    extraFetchOptions: {
                        // 各种参数
                    },
                    someFlag: true,
                },
            }).then(ret => {
                // 如果找到数据，则在then方法中返回
                // 注意：这是异步返回的结果（不了解异步请自行搜索学习）
                // 你只能在then这个方法内继续处理ret数据
                // 而不能在then以外处理
                // 也没有办法“变成”同步返回
                // 你也可以使用“看似”同步的async/await语法
                return ret
            }).then((responseData) => {
                resolve(responseData)
            }).catch(ret => {
                const data = {user: {id: ''}}
                resolve(data)
            })
        })

    }

    static _saveData(result) {
        storage.save({
            key: 'loginState',
            data: result,
            expires: null
        });
    }
}
