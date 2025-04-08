
import { of, throwError } from 'rxjs';
import { environmentDevelopment } from '../../../../environments/environment.development';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from './user.service';
import { usersList } from '../../../../test/data/users';
import { KeycloakProfile } from 'keycloak-js';

describe('UserService', () => {

  let userService: UserService;
  let httpClientMock: { get: jasmine.Spy; put: jasmine.Spy; post: jasmine.Spy, delete: jasmine.Spy };

  beforeEach(() => {
    httpClientMock = jasmine.createSpyObj('HttpClient', ['get', 'put', 'post', 'delete']);
    userService = new UserService(httpClientMock as any);
  });

  it('should set and get user profile', () => {
    // Arrange
    const userProfile: KeycloakProfile = {};

    // Act
    userService.setUserProfile(userProfile);

    // Assert
    expect(userService.getUserProfile()).toEqual(userProfile);
  });

  it('should retrieve all users successfully', function () {
    httpClientMock.get.and.returnValue(of(usersList));

    const result = userService.findAll();

    result.subscribe({
      next: roles => {
        expect(roles).toEqual(usersList);
        expect(httpClientMock.get).toHaveBeenCalledWith(`${environmentDevelopment.apiUrl}/users`);
      }
    });
  });

  it('should handle errors when retrieving users', function () {
    const mockError = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
    httpClientMock.get.and.returnValue(throwError(() => mockError));

    const result = userService.findAll();

    result.subscribe({
      next: () => fail('Expected an error to be thrown'),
      error: (error) => {
        expect(error).toEqual(mockError);
        expect(httpClientMock.get).toHaveBeenCalledWith(`${environmentDevelopment.apiUrl}/users`);
      }
    });
  });

  it('should create a new role', function () {
    const payload = {
      name: 'Role 5',
      description: 'Description 5',
      permissions: [
        'ACCESS_MY_ACCOUNT'
      ]
    };

    const repsonse = {
      roleId: 30,
      creationDate: '2024-04-20T15:32:44.990Z',
      modificationDate: '2024-04-20T15:32:44.990Z',
      name: 'Role 5',
      description: 'Description 5',
      externalReference: '89fdcc89-b355-433b-97e8-628047126178',
      permissions: [
        'ACCESS_MY_ACCOUNT'
      ]
    }
    httpClientMock.post.and.returnValue(of(repsonse));

    userService.createOrUpdate(payload).subscribe((data) => {
      expect(data).toEqual(repsonse);
    });
  });

  it('should send a PUT request to the correct API endpoint with the provided data and resource identity', function () {
    const payload = {
      roleId: 1,
      name: 'Role 1',
      description: 'Description 1',
      permissions: [
        'ACCESS_MY_ACCOUNT'
      ]
    };
    const resourceIdentity = 'roleId';
    const expectedUrl = `${environmentDevelopment.apiUrl}/users/${payload.roleId}`;

    httpClientMock.put.and.returnValue(of({}));

    userService.createOrUpdate(payload, resourceIdentity).subscribe();

    expect(httpClientMock.put).toHaveBeenCalledWith(expectedUrl, payload);
  });

  it('should send a DELETE request to the correct API endpoint with the given ID', function () {
    const id = 1;
    const expectedUrl = `${environmentDevelopment.apiUrl}/users/${id}`;
    httpClientMock.delete.and.returnValue(of({}));

    userService.delete(id).subscribe(() => {
      expect(httpClientMock.delete).toHaveBeenCalledWith(expectedUrl);
    });
  });

  it('should send a PUT request to the user API URL with the provided ID and password', function () {
    const id = '123';
    const pwd = 'password';
    const expectedUrl = `${environmentDevelopment.apiUrl}/users/update/${id}`;
    httpClientMock.put.and.returnValue(of({}));

    userService.updateUserPassword(id, pwd).subscribe(() => {
      expect(httpClientMock.put).toHaveBeenCalledWith(expectedUrl, pwd);
    });
  });

});
