import React, { useEffect, useRef, useState } from 'react';
import UploadTable from './UploadTable';
import DropFile from './DropFile';
import DropFileTable from './DropFileTable';
import { Button } from 'antd';
import UploadFileService from '../../../services/api.upload-file.service';
import DocumentService from '../../../services/api.document.service';

const UploadFile = ({
    setIsCancelDisabled,
    setIsOkDisabled,
    typeOfDoc,
    isClosing,
}) => {
    const [files, setFiles] = useState([]);
    const [responseFiles, setResponseFiles] = useState([]);
    const [selectedBank, setSelectedBank] = useState({});
    const [isReadyForUpload, setIsReadyForUpload] = useState(false);
    const [isReadyForUploadCheck, setIsReadyForUploadCheck] = useState(false);
    const [showUpdateTable, setShowUpdateTable] = useState(false);
    const [objectFile, setObjectFile] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        console.log('isReadyForUpload', isReadyForUpload);
    }, [isReadyForUpload]);

    const onDrop = (acceptedFiles) => {
        console.log(acceptedFiles);
        const initialFiles = acceptedFiles.map((file) => ({
            file,
            status: 'Uploading',
        }));

        setObjectFile(initialFiles);
        setFiles(acceptedFiles);
        if (typeOfDoc === 'check' && acceptedFiles.length > 0) {
            setIsReadyForUploadCheck(true);
        }
    };

    const currentProcessingItems = useRef([]);

    const updateResponseFileStatus = (id, newStatus) => {
        setResponseFiles((prevItems) =>
            prevItems.map((item) =>
                item.id === id ? { ...item, status: newStatus } : item
            )
        );
    };

    const updateProcessFiles = (dataItems) => {
        console.log(
            'Upload Modal - Current Items:',
            currentProcessingItems.current
        );

        const needDeleteItems = [];
        dataItems.forEach((item) => {
            if (item.status === 'processing') {
                if (!currentProcessingItems.current.includes(item.id)) {
                    currentProcessingItems.current.push(item.id);
                }
            } else {
                console.log(
                    'Upload Modal - Need Removing item from processing:',
                    item.id
                );
                needDeleteItems.push(item.id);
            }
        });

        currentProcessingItems.current = currentProcessingItems.current.filter(
            (id) => !needDeleteItems.includes(id)
        );

        console.log(
            'Modal Upload Updated currentProcessingChecks after update:',
            currentProcessingItems.current
        );

        if (currentProcessingItems.current.length > 0) {
            console.log('Calling requestIntervalTask');
            requestIntervalTask();
        }
    };

    const requestIntervalTask = () => {
        const interval = setInterval(async () => {
            if (currentProcessingItems.current.length === 0) {
                console.log(
                    'Upload Modal - Interval stopped because no items to process'
                );
                clearInterval(interval);
            } else {
                const documentIds = currentProcessingItems.current;
                const response = await DocumentService.checkStatusConverting(
                    documentIds
                );

                if (response && response.data) {
                    console.log(
                        'Check status converting response:',
                        response.data.result
                    );
                    response.data.result.forEach((item) => {
                        if (item.status !== 'processing') {
                            updateResponseFileStatus(
                                item.document_id,
                                item.status
                            );
                            currentProcessingItems.current =
                                currentProcessingItems.current.filter(
                                    (id) => id !== item.document_id
                                );
                        }
                    });
                }
            }
        }, 7000);
    };

    const handleUpload = async () => {
        setIsReadyForUpload(false);
        setIsReadyForUploadCheck(false);
        setShowUpdateTable(true);
        setIsCancelDisabled(true);
        try {
            setIsLoading(true);
            const formData = createFormData(
                files,
                typeOfDoc === 'check' ? null : selectedBank
            );
            const response = await UploadFileService.uploadFile(formData);
            if (typeOfDoc !== 'check') {
                if (response.data) {
                    console.log('response file upload data: ', response.data);
                    setResponseFiles(response.data.documents);
                }
            } else {
                let results = [];
                if (response.data) {
                    console.log('response file upload data: ', response.data);
                    results = response.data.documents;
                    if (response.data.documents_error.length > 0) {
                        let i = 1;
                        const errorFiles = response.data.documents_error.map(
                            (fileName) => {
                                return {
                                    id: `error-${i++}`,
                                    original_name: fileName,
                                    file_size: 0,
                                    status: 'error',
                                    type_of_doc: 'check',
                                };
                            }
                        );
                        results = [...results, ...errorFiles];
                    }
                }
                setResponseFiles(results);
            }
        } catch (error) {
            console.log(error);
            setIsCancelDisabled(false);
            setIsOkDisabled(false);
        }
        setIsCancelDisabled(false);
        setIsOkDisabled(false);
        setIsLoading(false);
    };

    const createFormData = (files, banks = null) => {
        const formData = new FormData();
        files.forEach((file, index) => {
            formData.append(`file${index + 1}`, file);
            // delete later;
            // formData.append(
            //   `bank${index + 1}`,
            //   "7f8c5b9c-4878-416c-a91d-886a8841bb96"
            // );
            if (banks) {
                formData.append(`bank${index + 1}`, banks[index]);
            }
        });
        formData.append('length', files.length);
        formData.append('type_of_doc', typeOfDoc);
        return formData;
    };

    const deleteFile = async (documentId, status) => {
        const fileNeedDelete = {
            documents: [{ id: documentId, status: status }],
        };
        console.log('fileNeedDelete: ', fileNeedDelete);
        try {
            const response = await DocumentService.deleteSelected(
                fileNeedDelete,
                typeOfDoc
            );
            if (response.status === 200) {
                console.log('Response delete file: ', response.data);
                const newFiles = responseFiles.filter(
                    (file) => file.id !== documentId
                );
                setResponseFiles(newFiles);
            }
        } catch (error) {
            console.log('Error deleting file: ', error);
        }
    };

    const convertFile = async (documentId) => {
        try {
            const response =
                typeOfDoc === 'check'
                    ? await DocumentService.covertCheckSelected([documentId])
                    : await DocumentService.convertStatementSelected([
                          documentId,
                      ]);
            if (response.data.response.documents.length > 0) {
                const newFiles = responseFiles.map((file) => {
                    if (file.id === documentId) {
                        file.status = 'processing';
                    }
                    return file;
                });
                setResponseFiles(newFiles);
                updateProcessFiles([{ id: documentId, status: 'processing' }]);
            }
        } catch (error) {
            console.log('Error convert file: ', error);
        }
    };

    useEffect(() => {
        const selectedBankLength = Object.keys(selectedBank).length;
        console.log(selectedBank);
        console.log(selectedBankLength, files.length);
        if (selectedBankLength > 0 && selectedBankLength == files.length) {
            setIsReadyForUpload(true);
        }
    }, [selectedBank]);

    useEffect(() => {
        console.log('files: ', files);
    }, [files]);

    useEffect(() => {
        currentProcessingItems.current = [];
    }, [isClosing]);

    return (
        <>
            <div className="p-4">
                {files.length === 0 ? (
                    <DropFile onDrop={onDrop} />
                ) : showUpdateTable ? (
                    <UploadTable
                        data={responseFiles}
                        onDeleteDocument={deleteFile}
                        onConvertDocument={convertFile}
                        isLoading={isLoading}
                    />
                ) : (
                    <DropFileTable
                        data={objectFile}
                        onChangeSelectedBank={setSelectedBank}
                        isDisabledBank={typeOfDoc !== 'check' ? false : true}
                    />
                )}
                {(isReadyForUploadCheck || isReadyForUpload) && (
                    <div className="flex justify-center mt-4">
                        <Button
                            onClick={handleUpload}
                            type="primary"
                            className="text-orange-400 border-2 border-orange-400 bg-white uppercase font-bold"
                        >
                            Upload
                        </Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default UploadFile;
