import apiDocumentResultStatementService from '../../../services/api.document-result-statement.service';

const fetchPageData = async (documentId, pageNumber) => {
    const response = await apiDocumentResultStatementService.getPerPage(
        documentId,
        pageNumber
    );
    const data = response.data;
    // console.log(' data:', data);

    if (!data || !data.tables) {
        return [{ headers: [], data: [] }];
    }

    const transformedTables = data.tables.map((table, tableIndex) => ({
        headers: table.headers.map((header) => header.text),
        data: table.data.map((row, rowIndex) => ({
            key: `${tableIndex}-${rowIndex}`,
            ...(Array.isArray(row)
                ? row.reduce((obj, cell, colIndex) => {
                      obj[`col_${colIndex}`] = cell.text;
                      return obj;
                  }, {})
                : {}),
        })),
    }));

    return transformedTables;
};

export default fetchPageData;
