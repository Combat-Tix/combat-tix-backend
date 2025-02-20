import mongoose from 'mongoose';
import Ticket from '../../models/ticket';

describe.skip('Ticket Model Test', () => {
  describe('Event ID Field', () => {
    it('Should throw an error if event id is not provided', () => {
      const ticket = new Ticket({});
      const validationErrors = ticket.validateSync();
      expect(validationErrors.errors.eventId).toBeDefined();
      expect(validationErrors.errors.eventId.message).toBe(
        'Please provide Event Id'
      );
    });
    it('Should throw an error if event id provided is not a mongodb object id type', () => {
      const ticket = new Ticket({ eventId: '1234' });
      const validationErrors = ticket.validateSync();
      expect(validationErrors.errors.eventId).toBeDefined();
    });
    it('Should pass if event id provided is  a mongodb object id type', () => {
      const ticket = new Ticket({
        eventId: new mongoose.Types.ObjectId('6696475178b2ced7e1b87d40'),
      });
      const validationErrors = ticket.validateSync();
      expect(validationErrors.errors.eventId).not.toBeDefined();
    });
  });
  describe('User ID Field', () => {
    it('Should throw an error if user id is not provided', () => {
      const ticket = new Ticket({});
      const validationErrors = ticket.validateSync();
      expect(validationErrors.errors.userId).toBeDefined();
      expect(validationErrors.errors.userId.message).toBe(
        'Please provide User Id'
      );
    });
    it('Should throw an error if user id provided is not a mongodb object id type', () => {
      const ticket = new Ticket({ userId: '1234' });
      const validationErrors = ticket.validateSync();
      expect(validationErrors.errors.userId).toBeDefined();
    });
    it('Should pass if user id provided is  a mongodb object id type', () => {
      const ticket = new Ticket({
        userId: new mongoose.Types.ObjectId('6696475178b2ced7e1b87d40'),
      });
      const validationErrors = ticket.validateSync();
      expect(validationErrors.errors.userId).not.toBeDefined();
    });
  });
  describe('QrCode Image Url Field', () => {
    it('Should throw an error if qrCodeImageUrl is not provided', () => {
      const ticket = new Ticket({});
      const validationErrors = ticket.validateSync();
      expect(validationErrors.errors.qrCodeImageUrl).toBeDefined();
      expect(validationErrors.errors.qrCodeImageUrl.message).toBe(
        'Please provide url for the QrCode image'
      );
    });
    it('Should pass if QrCode image url provided is of string type', () => {
      const ticket = new Ticket({ qrCodeImageUrl: 'https://' });
      const validationErrors = ticket.validateSync();
      expect(validationErrors.errors.qrCodeImageUrl).not.toBeDefined();
    });
  });
  describe('Payment Field', () => {
    describe('Amount', () => {
      it('Should throw an error if amount is not provided', () => {
        const ticket = new Ticket({});
        const validationErrors = ticket.validateSync();
        expect(validationErrors.errors.payment.amount).toBeDefined();
        expect(validationErrors.errors.payment.amount.message).toBe(
          'Please provide amount paid'
        );
      });
      it('Should throw an error if amount provided is not of Number type', () => {
        const ticket = new Ticket({ payment: { amount: '1234aabbb' } });
        const validationErrors = ticket.validateSync();
        expect(validationErrors.errors.payment.amount).toBeDefined();
      });
      it('Should pass if amount provided is of Number d type', () => {
        const ticket = new Ticket({ payment: { amount: 100000 } });
        const validationErrors = ticket.validateSync();
        expect(validationErrors.errors.payment.amount).not.toBeDefined();
      });
    });
    describe('Transaction ID', () => {
      it('Should throw an error if Transaction ID is not provided', () => {
        const ticket = new Ticket({});
        const validationErrors = ticket.validateSync();
        expect(validationErrors.errors.payment.transactionId).toBeDefined();
        expect(validationErrors.errors.payment.transactionId.message).toBe(
          'Please provide transaction id of payment'
        );
      });

      it('Should pass if Transaction ID provided is of String type', () => {
        const ticket = new Ticket({ payment: { transactionId: '1x00000' } });
        const validationErrors = ticket.validateSync();
        expect(
          validationErrors.errors.payment.transactionId
        ).not.toBeDefined();
      });
    });
    describe('Status', () => {
      it('Should throw an error if payment status is not provided', () => {
        const ticket = new Ticket({});
        const validationErrors = ticket.validateSync();
        expect(validationErrors.errors.payment.status).toBeDefined();
        expect(validationErrors.errors.payment.status.message).toBe(
          'Please provide payment id'
        );
      });
      it('Should pass if payment status provided is of String type', () => {
        const ticket = new Ticket({ payment: { status: 'processing' } });
        const validationErrors = ticket.validateSync();
        expect(validationErrors.errors.payment.status).not.toBeDefined();
      });
      ['processing', 'failed', 'success'].map((status) => {
        it(`Should the ${status} be a valid payment status`, () => {
          const ticket = new Ticket({ payment: { status } });
          const validationErrors = ticket.validateSync();
          expect(validationErrors.errors.payment.status).not.toBeDefined();
        });
      });
      it('Should throw an error if an invalid payment status is provided', () => {
        const ticket = new Ticket({ payment: { status: 'invalidStatus' } });
        const validationErrors = ticket.validateSync();
        expect(validationErrors.errors.payment.status).toBeDefined();
      });
    });
  });
});
