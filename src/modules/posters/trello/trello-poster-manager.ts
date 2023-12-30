import { PosterManager } from '../poster-manager';
import {
  BasePoster, FooterSize, MediaPoster, Poster, PosterType,
} from '../poster';
import {
  Card, TrelloClient, TrelloList, ViewFilter,
} from './client';

const DEFAULT_TIMEOUT = 15000;

export class TrelloPosterManager extends PosterManager {
  /**
   * Parse a Trello list recursively to a list of posters
   * @param list
   * @param all
   * @param type
   * @private
   */
  private parseLists(list: TrelloList, all: TrelloList[], type?: PosterType): Poster[] {
    // @ts-ignore
    const { cards } = list;
    const posters: Poster[][] = cards.map((card) => {
      // A card can be two things: a poster, or a reference to a new list of cards.
      // If it has the correct label ("Posterlist"), it means the card is a reference to a list
      if (card.labels?.includes('PosterList')) {
        const newList = all.find((l) => l.name === card.name);
        if (newList) {
          return this.parseLists(newList, all, card.desc as PosterType);
        }
        throw new Error(`Unknown list: ${card.name}`);
      }
    });
  }

  private parseBasePoster(card: Card): BasePoster {
    // Find the index of the "timeout" checklist if it exists
    const indexTimeout = card.checklists.findIndex((checklist) => checklist.name.toLowerCase() === 'timeout');
    // If it does exist, take the value of the first checkbox and make it the timeout value
    let timeout: number = DEFAULT_TIMEOUT;
    if (indexTimeout > -1) {
      timeout = parseInt(card.checklists[indexTimeout].checkItems[0].name, 10);
    }

    return {
      name: card.name || 'Poster',
      timeout,
      // If there is a due date present, set the due date
      due: card.due ? new Date(card.due) : undefined,
      // If there are labels, set the label of this poster to be the first label of the card
      label: card.labels && card.labels.length > 0 ? card.labels[0] : undefined,
      // If the card has a HIDE_LABEL label, set the footer size to minimal
      footer: card.labels && card.labels.includes('HIDE_LABEL') ? FooterSize.FULL : FooterSize.MINIMAL,
    };
  }

  private parseImagePoster(card: Card): MediaPoster {
    const poster = this.parseBasePoster(card);

    return {
      ...poster,
      type: PosterType.IMAGE,
      source: [],
    };
  }

  private parseVideoPoster(card: Card): MediaPoster {

  }

  private parsePhotoPoster(card: Card): Poster {}

  private parseExternalPoster(card: Card): Poster {}

  /**
   * Given a card, get all the attachments and save only the images to the disk
   * @param {string} cardId - ID of the card. Used to download all attachment objects from the Trello API
   */
  async findAndSaveAttachments(card: Card): Promise<string[]> {
    // Download all attachments and save them in a variable
    const attachments = (await axios.get(`${baseUrl}cards/${cardId}/attachments`, {
      params: {
        token: process.env.TRELLO_TOKEN,
        key: process.env.TRELLO_KEY,
      },
    })).data as IAttachment[];

    // Create an empty array to store all saved image location URLs
    const result: string[] = [];
    // For each attachment in the list of attachments...
    for (const attachment of attachments) {
      // Create the filename with the correct extension
      const fileExtension = getFileExtension(attachment.name);
      const fileName = `${attachment.id}.${fileExtension}`;

      // Download this image and wait for it to complete
      await this.downloadImageFiles(attachment.url, fileName).catch((error) => {
        console.log(error);
      });
      // Save the filename in the newly saved images array, used to delete unused attachments
      newlySavedImages.push(fileName);
      // Put this image URL in the resulting array
      result.push(`data/${fileName}`);
    }
    return result;
  }

  /**
   * Download a file and save it with the given filename in the /data/ directory
   * @param {string} fileUrl - location of the to be downloaded file
   * @param {string} fileName - new name of the file
   */
  async downloadImageFiles(fileUrl: string, fileName: string): Promise<void> {
    // If this file already exists, we do not need to download it again
    if (fs.existsSync(`data/${fileName}`)) {
      return;
    }

    // New trello update
    const headers = {
      Authorization: `OAuth oauth_consumer_key=\"${process.env.TRELLO_KEY}\", oauth_token=\"${process.env.TRELLO_TOKEN}\"`,
    };

    return axios.get(fileUrl, { responseType: 'stream', headers }).then((response) =>

    // ensure that the user can call `then()` only when the file has
    // been downloaded entirely.

      new Promise((resolve, reject) => {
        const fileWriter = fs.createWriteStream(`data/${fileName}`);
        response.data.pipe(fileWriter);
        let error: Error = null;
        fileWriter.on('error', (err) => {
          error = err;
          fileWriter.close();
          reject(err);
        });
        fileWriter.on('close', () => {
          if (!error) {
            resolve();
          }
          // no need to call the reject here, as it will have been called in the
          // 'error' stream;
        });
      }));
  }

  async getPosters(): Promise<Poster[]> {
    const client = new TrelloClient();
    const lists = await client.default.getBoardsIdLists(process.env.TRELLO_BOARD_ID || '', ViewFilter.ALL, 'all');
    return Promise.resolve([]);
  }
}
