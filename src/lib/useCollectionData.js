import 'firebase/firestore';
import { isEmpty } from 'lodash';
import { useCollectionData as useCollectionDataRFH } from 'react-firebase-hooks/firestore';

const useCollectionData = (collection, options) => {
  const [data, fetching, error] = useCollectionDataRFH(collection, {
    idField: 'id',
    snapshotListenOptions: { includeMetadataChanges: true },
    ...options,
  });
  return {
    count: data ? Object.keys(data).length : 0,
    data,
    error,
    fetching,
    isEmpty: isEmpty(data),
    loaded: data !== undefined,
  };
};

export default useCollectionData;
