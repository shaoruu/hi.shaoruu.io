import { LinkBlock } from '../components/LinkBlock';
import {
  githubLink,
  linkedInLink,
  mailLink,
  twitterLink,
  youtubeLink,
} from '../constants';

export function LinkBlocks() {
  return (
    <>
      <LinkBlock url={youtubeLink} blockName="Youtube" />
      <LinkBlock url={githubLink} blockName="Github" />
      <LinkBlock url={linkedInLink} blockName="LinkedIn" />
      <LinkBlock url={twitterLink} blockName="Twitter" />
      <LinkBlock url={mailLink} blockName="Mail" />
    </>
  );
}
