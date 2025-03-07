import Support from '../../models/support';

describe.skip('Support Model Tests', () => {
  it.skip('Should create a support request successfully', async () => {
    const supportData = {
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Need help with tickets',
    };
    const support = new Support(supportData);
    const validationErrors = support.validateSync();
    expect(validationErrors).toBeUndefined();
  });
  it('Should the name field be required', () => {
    const support = new Support({});
    const validationErrors = support.validateSync();
    expect(validationErrors.errors.name).toBeDefined();
  });
  describe('Email Field', () => {
    it('Should throw an error when email is missing', () => {
      const support = new Support({});
      const validationErrors = support.validateSync();
      expect(validationErrors.errors.email).toBeDefined();
      expect(validationErrors.errors.email.message).toBe(
        'Please provide an email address'
      );
    });
    it('Should throw an error if email is invalid', () => {
      const support = new Support({
        name: 'Omosuyi Olawole',
        email: 'gmail.com',
        message: 'Please give me access',
      });
      const validationErrors = support.validateSync();
      expect(validationErrors.errors.email).toBeDefined();
      expect(validationErrors.errors.email.message).toBe(
        'Please provide a valid email address'
      );
    });
  });
  it('Should throw an error when message field is missing', () => {
    const support = new Support({});
    const validationErrors = support.validateSync();
    expect(validationErrors.errors.message).toBeDefined();
    expect(validationErrors.errors.message.message).toBe(
      'Please provide support message'
    );
  });
});
