import React, { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import PdfSide from '../../components/Review/PdfSide';
import CheckConvertSide from '../../components/Review/Check/CheckConvertSide';
import './ReviewStyle.css';
import { useParams } from 'react-router-dom';

const CheckReview = () => {
    const [numPages, setNumPages] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);
    const documentId = useParams().id;
    console.log('documentId', documentId);
    return (
        <div className="review-page min-h-[100vh] px-14 py-8">
            <div className="flex gap-4">
                <div className="pdf-side w-2/5 h-full">
                    <a
                        href="/checks"
                        className="text-gray-600 hover:text-black"
                    >
                        <ArrowLeftOutlined className="pr-2" />
                        Back to Dashboard
                    </a>
                    <div className="pdf-view-container h-full bg-gray-100 p-4 mt-4">
                        <PdfSide
                            numPages={numPages}
                            setNumPages={setNumPages}
                            pageNumber={pageNumber}
                            setPageNumber={setPageNumber}
                            documentId={documentId}
                        ></PdfSide>
                    </div>
                </div>
                <div className="convert-side w-3/5 min-h-[100vh]">
                    <CheckConvertSide
                        pageNumber={pageNumber}
                        documentId={documentId}
                    ></CheckConvertSide>
                </div>
            </div>
        </div>
    );
};

export default CheckReview;
