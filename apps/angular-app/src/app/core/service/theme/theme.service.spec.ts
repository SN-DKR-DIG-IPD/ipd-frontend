

import { of } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ThemeModel } from '../../../data/model/theme.model';
import { ThemeService } from './theme.service';

describe('ThemeService', () => {
  it('should send a POST request to the correct API endpoint with the provided data', () => {
    const httpClientMock = jasmine.createSpyObj('HttpClient', ['post']);
    const themeService = new ThemeService(httpClientMock);
    const data: ThemeModel = {
      layout_content: {
        bg: {
          color: 'red',
        },
        text: {
          color: 'blue'
        }
      },
      sidebar: {
        bg: {
          color: 'green',
        },
        nav: {
          link: {
            bg: {
              color: 'yellow',
              active: 'orange',
              hover: 'purple'
            },
            text: {
              color: 'pink',
              active: 'brown',
              hover: 'gray'
            }
          }
        }
      },
      navbar: {
        bg: {
          color: 'black',
        },
        usermenu: {
          bg: {
            color: 'white',
          },
          item: {
            bg: {
              color: 'cyan',
              hover: 'magenta'
            },
            text: {
              color: 'teal',
              hover: 'indigo'
            }
          }
        }
      },
      card: {
        bg: {
          color: 'silver',
        },
        text: {
          color: 'gold',
        }
      },
      button: {
        bg: {
          color: 'maroon',
        },
        text: {
          color: 'olive',
        }
      }
    };
    const url = environment.apiUrl + '/users/theme';
    httpClientMock.post.and.returnValue(of({}));

    themeService.save(data).subscribe(() => {
      expect(httpClientMock.post).toHaveBeenCalledWith(url, data);
    });
  });
});
