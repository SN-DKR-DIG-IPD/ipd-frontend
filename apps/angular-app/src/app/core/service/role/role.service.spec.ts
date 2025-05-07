import { RoleService } from './role.service';
import { of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { HttpErrorResponse } from '@angular/common/http';
import { rolesList } from '../../../../test/data/roles';

describe('RoleService', () => {

  let httpClientMock = jasmine.createSpyObj('HttpClient', ['post', 'get', 'delete', 'put']);
  let roleService = new RoleService(httpClientMock);

  it('should retrieve all roles successfully', function () {
    httpClientMock.get.and.returnValue(of(rolesList));

    const result = roleService.findAll();

    result.subscribe({
      next: roles => {
        expect(roles).toEqual(rolesList);
        expect(httpClientMock.get).toHaveBeenCalledWith(`${environment.apiUrl}/roles`);
      }
    });
  });

  it('should handle errors when retrieving roles', function () {
    const mockError = new HttpErrorResponse({ status: 500, statusText: 'Internal Server Error' });
    httpClientMock.get.and.returnValue(throwError(() => mockError));

    const result = roleService.findAll();

    result.subscribe({
      next: () => fail('Expected an error to be thrown'),
      error: (error) => {
        expect(error).toEqual(mockError);
        expect(httpClientMock.get).toHaveBeenCalledWith(`${environment.apiUrl}/roles`);
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

    roleService.createOrUpdate(payload).subscribe((data) => {
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
    const expectedUrl = `${environment.apiUrl}/roles/${payload.roleId}`;

    httpClientMock.put.and.returnValue(of({}));

    roleService.createOrUpdate(payload, resourceIdentity).subscribe();

    expect(httpClientMock.put).toHaveBeenCalledWith(expectedUrl, payload);
  });

  it('should send a DELETE request to the correct API endpoint with the given ID', function () {
    const id = 1;
    const expectedUrl = `${environment.apiUrl}/roles/${id}`;
    httpClientMock.delete.and.returnValue(of({}));

    roleService.delete(id).subscribe(() => {
      expect(httpClientMock.delete).toHaveBeenCalledWith(expectedUrl);
    });
  });

});
