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
    const randomDelay = Math.ceil(Math.random() * 10000);
    const shouldResolve = Math.floor(Math.random() * 2);
    setTimeout(() => {
      !!shouldResolve ? res('Resolved') : rej('Rejected');
    }, randomDelay);
  });
};

const testMock = () => {
  const instance = TaskQ.initialiseTaskQ({
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

  const addTask = (
    key: string,
    taskType: string,
    dependentTaskKeys: string[],
    taskGraphId: string = '',
    shouldExecute: any = shouldExecuteGeneral,
    doExecute: any = dummyExecute,
  ) => {
    instance.addTask(
      {
        dependentTaskKeys,
      },
      {
        data: {
          taskGraphId,
          taskType,
        },
      },
    );
  };

  const updateTravelTask = (taskGraphId: string) => {
    addTask(`TaskId-Travel-${taskGraphId}`, 'Travel', [], taskGraphId);
  };
  const updateScanBarCodeTask = (taskGraphId: string) => {
    addTask(
      `TaskId-ScanBarcode-${taskGraphId}`,
      'ScanBarCode',
      [`TaskId-Travel-${taskGraphId}`],
      taskGraphId,
    );
  };
  const uploadImageTask1 = (taskGraphId: string) => {
    addTask(
      `TaskId-UploadMedia1-${taskGraphId}`,
      'UploadMedia',
      [`TaskId-ScanBarcode-${taskGraphId}`],
      taskGraphId,
    );
  };
  const uploadImageTask2 = (taskGraphId: string) => {
    addTask(
      `TaskId-UploadMedia2-${taskGraphId}`,
      'UploadMedia',
      [`TaskId-ScanBarcode-${taskGraphId}`],
      taskGraphId,
    );
  };
  const uploadImageTask3 = (taskGraphId: string) => {
    addTask(
      `TaskId-UploadMedia3-${taskGraphId}`,
      'UploadMedia',
      [`TaskId-ScanBarcode-${taskGraphId}`],
      taskGraphId,
    );
  };
  const uploadImageTask4 = (taskGraphId: string) => {
    addTask(
      `TaskId-UploadMedia4-${taskGraphId}`,
      'UploadMedia',
      [`TaskId-ScanBarcode-${taskGraphId}`],
      taskGraphId,
    );
  };
  const uploadImageTask5 = (taskGraphId: string) => {
    addTask(
      `TaskId-UploadMedia5-${taskGraphId}`,
      'UploadMedia',
      [`TaskId-ScanBarcode-${taskGraphId}`],
      taskGraphId,
    );
  };
  const updateUploadImageTask = (taskGraphId: string) => {
    addTask(
      `TaskId-UploadImage-${taskGraphId}`,
      'UploadImage',
      [`TaskId-ScanBarcode-${taskGraphId}`],
      taskGraphId,
    );
  };
  const updateCOPTask = (taskGraphId: string) => {
    addTask(
      `TaskId-COP-${taskGraphId}`,
      'COP',
      [`TaskId-UploadImage-${taskGraphId}`],
      taskGraphId,
    );
  };
  const updateSignatureTask = (taskGraphId: string) => {
    addTask(
      `TaskId-Signature-${taskGraphId}`,
      'Signature',
      [`TaskId-COP-${taskGraphId}`],
      taskGraphId,
    );
  };
  const updateTerminalTask = (taskGraphId: string) => {
    addTask(
      `TaskId-Terminal-${taskGraphId}`,
      'Terminal',
      [
        `TaskId-Signature-${taskGraphId}`,
        `TaskId-UploadMedia1-${taskGraphId}`,
        `TaskId-UploadMedia2-${taskGraphId}`,
        `TaskId-UploadMedia3-${taskGraphId}`,
        `TaskId-UploadMedia4-${taskGraphId}`,
        `TaskId-UploadMedia5-${taskGraphId}`,
      ],
      taskGraphId,
    );
  };

  const testOrderedTasks = () => {
    updateTravelTask('GRAPH1');
    updateScanBarCodeTask('GRAPH1');
    uploadImageTask1('GRAPH1');
    uploadImageTask2('GRAPH1');
    uploadImageTask4('GRAPH1');
    uploadImageTask3('GRAPH1');
    uploadImageTask5('GRAPH1');
    updateUploadImageTask('GRAPH1');
    updateSignatureTask('GRAPH1');
    updateCOPTask('GRAPH1');
    updateTerminalTask('GRAPH1');
  };

  const testJumbledTasks = () => {
    updateScanBarCodeTask('GRAPH1');
    updateTravelTask('GRAPH1');
    uploadImageTask1('GRAPH1');
    uploadImageTask2('GRAPH1');
    updateSignatureTask('GRAPH1');
    uploadImageTask4('GRAPH1');
    uploadImageTask3('GRAPH1');
    updateCOPTask('GRAPH1');
    uploadImageTask5('GRAPH1');
    updateUploadImageTask('GRAPH1');
    updateTerminalTask('GRAPH1');
  };

  const testNotDependentTask = () => {
    addTask(`TaskId-Travel-GRAPH1`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH2`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH3`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH4`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH5`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH6`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH7`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH8`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH9`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH10`, 'Travel', []);
  };

  const testDeadlock = () => {
    addTask(`TaskId-Travel-GRAPH1`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH2`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH3`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH4`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH5`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH6`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH7`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH8`, 'Travel', []);
    addTask(`TaskId-Travel-GRAPH9`, 'Travel', ['TaskId-Travel-GRAPH10']);
    addTask(`TaskId-Travel-GRAPH10`, 'Travel', ['TaskId-Travel-GRAPH9']);
  };

  const delay = () => {
    return new Promise((res) => {
      setTimeout(() => res(true), 1000);
    });
  };

  // testNotDependentTask();
  testOrderedTasks();
  // testJumbledTasks();
  // testDeadlock();
};

export default testMock;
