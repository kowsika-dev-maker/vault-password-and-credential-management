import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import LoginForm from './LoginForm';
import API from '../../services/api';

jest.mock('../../services/api', () => ({
  __esModule: true,
  default: {
    post: jest.fn(),
  },
}));

describe('LoginForm', () => {
  beforeEach(() => {
    API.post.mockResolvedValue({
      data: { message: 'Login Successful', token: 'test-token' },
    });
  });

  it('submits the login request to the auth endpoint without a leading slash', async () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>
    );

    await userEvent.type(screen.getByPlaceholderText(/enter email/i), 'user@example.com');
    await userEvent.type(screen.getByPlaceholderText(/enter password/i), 'password123');
    await userEvent.click(screen.getByRole('button', { name: /login/i }));

    expect(API.post).toHaveBeenCalledWith(
      'auth/login',
      expect.objectContaining({
        email: 'user@example.com',
        password: 'password123',
      })
    );
  });
});
