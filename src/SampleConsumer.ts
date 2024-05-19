// import RealmInterface from './storage/realmInterface';
import TaskQ from './TaskQ';

const shouldExecuteGeneral = ({ task }: any) => {
  const { characteristics = {} } = task;
  if (
    characteristics.failedAttempts &&
    characteristics.failedAttempts > 3 &&
    ['FAILURE'].includes(task.state)
  )
    return false;
  return true;
};

const dummyExecute = () => {
  return new Promise((res, rej) => {
    const randomDelay = Math.ceil(Math.random() * 5000);
    const shouldResolve = Math.floor(Math.random() * 2);
    setTimeout(() => {
      !!shouldResolve ? res('Resolved') : rej('Rejected');
    }, randomDelay);
  });
};

const testMock = () => {
  const instance = TaskQ.initialiseTaskQ({
    // storage: new RealmInterface(),
    characteristics: {
      serverEndpoint: 'https://jeeves.flipkart.com',
    },
    networkConfig: {
      pingServerUrl: 'https://jeeves.flipkart.com/health_check',
      customHeaders: {
        'X-AUTH-TOKEN': 'bf1a832e35d680f7fe731106b8c507c82d35affd',
        USERNAME: 'DUMMY_123',
      },
    },
    keepSuccessResponse: true,
    concurrancyDemanded: 5,
    shouldExecute: shouldExecuteGeneral,
    doExecute: dummyExecute,
    onSuccess: (task) => {
      console.log(`TASK ${task.key} SUCCESSFULL...`);
    },
    onFailure: (task) => {
      console.log(`TASK ${task.key} FAILED...`);
    },
  });

  const addTask = async (
    key: string,
    taskType: string,
    dependentTaskKeys: string[],
    taskGraphId: string = '',
  ) => {
    const addedTaskKey = instance.addTask(
      {
        dependentTaskKeys,
      },
      {
        data: {
          key,
          taskGraphId,
          taskType,
        },
      },
    );
    return addedTaskKey;
  };

  let travelTaskId = '';
  let barcodeTaskId = '';
  let image1TaskId = '';
  let image2TaskId = '';
  let image3TaskId = '';
  let image4TaskId = '';
  let image5TaskId = '';
  let uploadImageTaskId = '';
  let copTaskId = '';
  let signatureTaskId = '';
  let terminalTaskId = '';

  const updateTravelTask = async (taskGraphId: string) => {
    travelTaskId = await addTask(`Travel`, 'Travel', [], taskGraphId);
  };
  const updateScanBarCodeTask = async (taskGraphId: string) => {
    barcodeTaskId = await addTask(
      `ScanBarcode`,
      'ScanBarCode',
      [travelTaskId],
      taskGraphId,
    );
  };
  const uploadImageTask1 = async (taskGraphId: string) => {
    console.log('Barcode task ID', barcodeTaskId);
    image1TaskId = await addTask(
      `UploadMedia1`,
      'UploadMedia',
      [barcodeTaskId],
      taskGraphId,
    );
  };
  const uploadImageTask2 = async (taskGraphId: string) => {
    image2TaskId = await addTask(
      `UploadMedia2`,
      'UploadMedia',
      [barcodeTaskId],
      taskGraphId,
    );
  };
  const uploadImageTask3 = async (taskGraphId: string) => {
    image3TaskId = await addTask(
      `UploadMedia3`,
      'UploadMedia',
      [barcodeTaskId],
      taskGraphId,
    );
  };
  const uploadImageTask4 = async (taskGraphId: string) => {
    image4TaskId = await addTask(
      `UploadMedia4`,
      'UploadMedia',
      [barcodeTaskId],
      taskGraphId,
    );
  };
  const uploadImageTask5 = async (taskGraphId: string) => {
    image5TaskId = await addTask(
      `UploadMedia5`,
      'UploadMedia',
      [barcodeTaskId],
      taskGraphId,
    );
  };
  const updateUploadImageTask = async (taskGraphId: string) => {
    uploadImageTaskId = await addTask(
      `UploadImage`,
      'UploadImage',
      [barcodeTaskId],
      taskGraphId,
    );
  };
  const updateCOPTask = async (taskGraphId: string) => {
    copTaskId = await addTask(`COP`, 'COP', [uploadImageTaskId], taskGraphId);
  };
  const updateSignatureTask = async (taskGraphId: string) => {
    signatureTaskId = await addTask(
      `Signature`,
      'Signature',
      [copTaskId],
      taskGraphId,
    );
  };
  const updateTerminalTask = async (taskGraphId: string) => {
    terminalTaskId = await addTask(
      `Terminal`,
      'Terminal',
      [
        signatureTaskId,
        image1TaskId,
        image2TaskId,
        image3TaskId,
        image4TaskId,
        image5TaskId,
      ],
      taskGraphId,
    );
  };

  const testOrderedTasks = async () => {
    await updateTravelTask('GRAPH1');
    await updateScanBarCodeTask('GRAPH1');
    await uploadImageTask1('GRAPH1');
    await uploadImageTask2('GRAPH1');
    await uploadImageTask4('GRAPH1');
    await uploadImageTask3('GRAPH1');
    await uploadImageTask5('GRAPH1');
    await updateUploadImageTask('GRAPH1');
    await updateCOPTask('GRAPH1');
    await updateSignatureTask('GRAPH1');
    await updateTerminalTask('GRAPH1');
  };

  const testJumbledTasks = async () => {
    await updateScanBarCodeTask('GRAPH1');
    await updateTravelTask('GRAPH1');
    await uploadImageTask1('GRAPH1');
    await uploadImageTask2('GRAPH1');
    await updateSignatureTask('GRAPH1');
    await uploadImageTask4('GRAPH1');
    await uploadImageTask3('GRAPH1');
    await updateCOPTask('GRAPH1');
    await uploadImageTask5('GRAPH1');
    await updateUploadImageTask('GRAPH1');
    await updateTerminalTask('GRAPH1');
  };

  const testNotDependentTask = async () => {
    await addTask(`TaskId-Travel-GRAPH1`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH2`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH3`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH4`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH5`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH6`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH7`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH8`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH9`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH10`, 'Travel', []);
  };

  const testDeadlock = async () => {
    await addTask(`TaskId-Travel-GRAPH1`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH2`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH3`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH4`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH5`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH6`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH7`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH8`, 'Travel', []);
    await addTask(`TaskId-Travel-GRAPH9`, 'Travel', ['TaskId-Travel-GRAPH10']);
    await addTask(`TaskId-Travel-GRAPH10`, 'Travel', ['TaskId-Travel-GRAPH9']);
  };

  const delay = () => {
    return new Promise((res) => {
      setTimeout(() => res(true), 1000);
    });
  };

  const searchTask = () => {
    instance.searchTask({
      filter: (task) => task.state === 'SUCCESS',
    });
  };

  // testNotDependentTask();
  testOrderedTasks();
  // testJumbledTasks();
  // testDeadlock();
};

export default testMock;
