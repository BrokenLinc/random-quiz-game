import 'firebase/firestore';
import { useDocumentData as useDocumentDataRFH } from 'react-firebase-hooks/firestore';

const useDocumentData = (document, options) => {
  const [data, fetching, error] = useDocumentDataRFH(document, {
    idField: 'id',
    snapshotListenOptions: { includeMetadataChanges: true },
    ...options,
  });
  return {
    data,
    error,
    fetching,
    loaded: data !== undefined,
  };
};

export default useDocumentData;
