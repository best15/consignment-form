//  generate id for new consignment
export const generateId = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 9000) + 1000;
    return `CNS-${timestamp}-${randomNum}`;
  };
