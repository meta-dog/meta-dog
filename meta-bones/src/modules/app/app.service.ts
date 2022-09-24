import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { App, AppDocument } from '@schemas/app.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Advocate, AdvocateDocument } from '@schemas/advocate.schema';
import axios from 'axios';

@Injectable()
export class AppService {
  constructor(
    @InjectModel(Advocate.name)
    private advocateModel: Model<AdvocateDocument>,
    @InjectModel(App.name) private appModel: Model<AppDocument>,
  ) {}
  async findAll(): Promise<App[]> {
    return await this.appModel.find().exec();
  }

  async getReferralForAppByAppId(app_id: App['app_id']): Promise<Advocate> {
    const app = await this.appModel
      .findOne({ app_id: app_id })
      .populate('advocates');
    if (app === null) throw new NotFoundException();
    const { advocates: advocatesWhoOwnTheApp } = app;

    const numAdvocatesWhoOwnTheApp = advocatesWhoOwnTheApp.length;
    if (numAdvocatesWhoOwnTheApp === 0) throw new NotFoundException();
    const winnerIndex = Math.floor(Math.random() * numAdvocatesWhoOwnTheApp);
    const id_ = advocatesWhoOwnTheApp[winnerIndex];
    const advocate = await this.advocateModel.findById(id_);
    if (advocate === null) throw new NotFoundException();
    return advocate;
  }

  private async getNameFromUrl(url: string) {
    Logger.log(`Fetching url ${url}`);
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
    } catch (exception) {
      Logger.error(`Provided url ${url} was invalid`);
      throw exception;
    }
  }

  private async getAppId(
    advocate_id: Advocate['advocate_id'],
    app_id: App['app_id'],
  ) {
    const app = await this.appModel.findOne({ app_id: app_id });
    if (app !== null) return app;
    Logger.log(`Creating App with id ${app_id} as it was not found`);
    const url = `/${advocate_id}/${app_id}`;
    const name = await this.getNameFromUrl(url);
    const newApp = new App();
    newApp.app_id = app_id;
    newApp.name = name;
    newApp.advocates = [];
    return await this.appModel.create(newApp);
  }

  async createReferral(
    advocate_id: Advocate['advocate_id'],
    app_id: App['app_id'],
  ): Promise<void> {
    const app = await this.getAppId(advocate_id, app_id);
    const advocate = await this.advocateModel
      .findOne({ advocate_id: advocate_id })
      .populate('apps');
    if (advocate === null) {
      const newAdvocate = new Advocate();
      newAdvocate.advocate_id = advocate_id;
      newAdvocate.apps = [app._id];
      Logger.log(`Creating Advocate ${advocate_id} as it was not found`);
      const createdAdvocate = await this.advocateModel.create(newAdvocate);
      await this.appModel.updateMany(
        { _id: app._id },
        { $addToSet: { advocates: createdAdvocate._id } },
      );
      return;
    }
    const anyAdvocate = await this.appModel.find({
      $and: [{ _id: app._id }, { advocates: advocate._id }],
    });
    if (anyAdvocate.length > 0) {
      Logger.error(`Attempted dupe referral for ${advocate_id}:${app_id}`);
      throw new ConflictException();
    }
    await this.advocateModel.updateMany(
      { _id: advocate._id },
      { $addToSet: { apps: app._id } },
    );
    await this.appModel.updateMany(
      { _id: app._id },
      { $addToSet: { advocates: advocate._id } },
    );
  }
}
