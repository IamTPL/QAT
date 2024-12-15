class TableStatementModel {
    constructor(data) {
        console.log('Data:', data);
        this.data = data.map((item) => ({
            ...item,
            key: item.id, // Assign key for React rendering optimization
        }));
        this.headers = this.generateHeaders();
    }

    generateHeaders() {
        if (this.data.length === 0) return {};
        // Generate headers dynamically, excluding 'id'
        return Object.keys(this.data[0]).reduce((headers, key) => {
            if (key !== 'id') {
                headers[key] = key;
            }
            return headers;
        }, {});
    }

    updateRecord(recordKey, dataIndex, value) {
        this.data = this.data.map((item) => {
            if (item.key === recordKey) {
                return { ...item, [dataIndex]: value };
            }
            return item;
        });
    }

    getHeaders() {
        return this.headers;
    }

    getData() {
        return this.data;
    }
}

export default TableStatementModel;
