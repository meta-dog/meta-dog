import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Advocate } from '@entities/advocate';
import { Repository } from 'typeorm';
import { App } from '@entities/app';
import axios from 'axios';

@Injectable()
export class ReferralService {
  constructor(
    @InjectRepository(Advocate)
    private advocateRepository: Repository<Advocate>,
    @InjectRepository(App)
    private appRepository: Repository<App>,
  ) {}

  async findByAppId(app_id: App['app_id']): Promise<Advocate> {
    const allAdvocatesWhoOwnTheAppId = await this.advocateRepository.find({
      relations: { apps: true },
      where: { apps: { app_id } },
    });

    if (allAdvocatesWhoOwnTheAppId.length === 0) throw new NotFoundException();
    const index = Math.floor(Math.random() * allAdvocatesWhoOwnTheAppId.length);

    return allAdvocatesWhoOwnTheAppId[index];
  }

  private async getNameFromUrl(url: string) {
    console.dir(url);
    const request = await axios.get(url, {
      baseURL: 'https://www.oculus.com/appreferrals',
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36',
        'Accept-Language': 'en-GB,en;q=0.9',
        accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
        'sec-ch-ua-platform': 'Windows',
        'sec-ch-ua':
          'Google Chrome";v="105", "Not)A;Brand";v="8", "Chromium";v="105"',
        'sec-ch-ua-mobile': '?0',
        'sec-fetch-dest': 'Document',
        'sec-fetch-mode': 'navigate',
        'sec-fetch-site': 'none',
        'sec-fetch-user': '?1',
        'upgrade-insecure-requests': '1',
        dnt: '1',
      },
    });
    try {
      const { data } = request;
      const regex = /(?<=Get\ 25%\ off\ )(.*?)(?= \| Meta Quest)/g;
      const match = (data as string).match(regex);
      if (match === null) throw new NotFoundException();
      const [name] = match;
      if (name === undefined) throw new NotFoundException();
      return name;
    } catch (_) {
      throw new NotFoundException();
    }
  }

  async getApp(advocate_id: Advocate['advocate_id'], app_id: App['app_id']) {
    const app = await this.appRepository.findOneBy({ app_id });
    if (app !== null) return app;
    else {
      const url = `/${advocate_id}/${app_id}`;
      const name = await this.getNameFromUrl(url);
      const newApp = new App();
      newApp.app_id = app_id;
      newApp.name = name;
      newApp.advocates = [];
      return await this.appRepository.save(newApp);
    }
  }

  async create(
    advocate_id: Advocate['advocate_id'],
    app_id: App['app_id'],
  ): Promise<Advocate> {
    const app = await this.getApp(advocate_id, app_id);
    const advocate = await this.advocateRepository.find({
      relations: { apps: true },
      where: { advocate_id },
    });
    if (advocate.length === 0) {
      const newAdvocate = new Advocate();
      newAdvocate.advocate_id = advocate_id;
      newAdvocate.apps = [app];
      return await this.advocateRepository.save(newAdvocate);
    }
    const currentAdvocate = advocate[0];
    if (currentAdvocate.apps.some(({ app_id }) => app_id === app.app_id)) {
      throw new ConflictException();
    }
    currentAdvocate.apps = [...currentAdvocate.apps, app];
    return await this.advocateRepository.save(currentAdvocate);
  }
}
