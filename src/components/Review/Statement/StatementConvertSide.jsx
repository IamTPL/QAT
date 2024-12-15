import React, { useReducer, useEffect, useCallback } from 'react';
import { Tabs, Modal, message } from 'antd';
import {
    CloudOutlined,
    DownloadOutlined,
    RedoOutlined,
} from '@ant-design/icons';
import TableStatement from './TableStatement';
import DocumentResultStatementService from '../../../services/api.document-result-statement.service';
import fetchPageData from './fetchPageData';
import DocumentService from '../../../services/api.document.service';
import {
    statementResultReducer,
    initialState,
} from '../../../reducers/statementResultReducer.js';
import * as ActionTypes from '../../../constants/statementResultConstant.js';

const { confirm } = Modal;

const StatementConvertSide = ({ pageNumber, documentId }) => {
    const [state, dispatch] = useReducer(statementResultReducer, initialState);

    // Fetch data on page load
    const fetchData = useCallback(async () => {
        try {
            const fetchedTables = await fetchPageData(documentId, pageNumber);
            console.log('fetchedTables:', fetchedTables);
            dispatch({ type: ActionTypes.SET_TABLES, payload: fetchedTables });
        } catch (error) {
            message.error('Error fetching tables');
            console.error('Error fetching tables:', error);
        }
    }, [documentId, pageNumber]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // Update specific table
    const updateTable = (index, data) => {
        dispatch({ type: ActionTypes.UPDATE_TABLE, payload: { index, data } });
    };

    // Handle tab changes
    const handleTabChange = (key) => {
        dispatch({ type: ActionTypes.SET_ACTIVE_KEY, payload: key });
    };

    //handle reset
    const handleReset = async () => {
        confirm({
            title: 'Are you sure?',
            content:
                'Resetting will erase all changes made to the converted file.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    // Reset file on the backend
                    await DocumentService.resetFile(documentId);

                    // Dispatch RESET_STATE to clear the state
                    dispatch({ type: ActionTypes.RESET_STATE });

                    // Refetch the data and update state
                    fetchData();
                    message.success('Page reset successfully');
                } catch (error) {
                    message.error('Error resetting page');
                    console.error('Error resetting page:', error);
                }
            },
            onCancel() {
                console.log('Cancel reset');
            },
        });
    };

    // Handle tab removal
    const handleTabRemoval = (targetKey) => {
        confirm({
            title: 'Are you sure you want to delete this table?',
            content: 'This will remove all associated data.',
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                const targetIndex = parseInt(targetKey, 10);
                try {
                    await DocumentResultStatementService.deleteTable(
                        documentId,
                        pageNumber,
                        targetIndex
                    );
                    const filteredTables = state.tables.filter(
                        (_, index) => index !== targetIndex
                    );
                    const newActiveKey =
                        targetKey === state.activeKey
                            ? targetIndex > 0
                                ? `${targetIndex - 1}`
                                : filteredTables.length > 0
                                ? '0'
                                : null
                            : state.activeKey;

                    dispatch({
                        type: ActionTypes.REMOVE_TABLE,
                        payload: { tables: filteredTables, newActiveKey },
                    });
                } catch (error) {
                    message.error('Failed to delete table');
                    console.error('Error deleting table:', error);
                }
            },
        });
    };

    // Download handler
    const handleDownload = async () => {
        try {
            await DocumentResultStatementService.downloadXLSXFiles([
                documentId,
            ]);
        } catch (error) {
            message.error('Error downloading file');
            console.error('Error downloading file:', error);
        }
    };

    // Generate tab items
    const tabItems = state.tables.map((table, index) => ({
        key: `${index}`,
        label: `Table ${index + 1}`,
        children: (
            <TableStatement
                data={table.data}
                setData={(newData) => updateTable(index, { data: newData })}
                columnHeaders={table.headers}
                setColumnHeaders={(newHeaders) =>
                    updateTable(index, { headers: newHeaders })
                }
                tableIndex={index}
                pageNumber={pageNumber}
                documentId={documentId}
                setIsSaving={(saving) =>
                    dispatch({
                        type: ActionTypes.SET_IS_SAVING,
                        payload: saving,
                    })
                }
            />
        ),
    }));

    return (
        <div className="convert_statement">
            <h2 className="text-end font-bold mb-4">Page {pageNumber}</h2>
            <div className="flex justify-between items-center mb-4">
                <div className="font-bold">Review (update as necessary)</div>
                <div className="flex gap-4 items-center">
                    <span className="px-2 py-1 border rounded-lg text-xs text-gray-500">
                        {state.isSaving ? (
                            <>
                                <CloudOutlined className="mr-2" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <CloudOutlined className="mr-2" />
                                Saved
                            </>
                        )}
                    </span>
                    <button
                        className="px-4 py-1 text-sm font-bold bg-gray-100  rounded-lg flex items-center space-x-2"
                        onClick={handleReset}
                    >
                        Reset <RedoOutlined className="ml-2" />
                    </button>
                    <button
                        className="px-4 py-1 text-sm font-bold bg-orange-400 text-white rounded-lg flex items-center space-x-2 hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
                        onClick={handleDownload}
                    >
                        Download <DownloadOutlined className="ml-2" />
                    </button>
                </div>
            </div>
            <Tabs
                key={state.tables.length}
                hideAdd
                onChange={handleTabChange}
                type="editable-card"
                onEdit={(_, action) => {
                    if (action === 'remove') {
                        handleTabRemoval(state.activeKey);
                    }
                }}
                activeKey={state.activeKey}
                items={tabItems}
            />
        </div>
    );
};

export default StatementConvertSide;
