import { LinkBlock } from '../components/LinkBlock';
import {
  buyMeACoffeeLink,
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
      <LinkBlock url={buyMeACoffeeLink} blockName="BuyMeACoffee" />

      <LinkBlock
        url="https://github.com/shaoruu/voxelize"
        blockName="Trophy (voxelize)"
      />
      <LinkBlock
        url="https://github.com/shaoruu/mc.js"
        blockName="Trophy (mc.js)"
      />
      <LinkBlock
        url="https://github.com/shaoruu/modern-graphql-tutorial"
        blockName="Trophy (modern-graphql-tutorial)"
      />
      <LinkBlock
        url="https://github.com/shaoruu/mine.js"
        blockName="Trophy (mine.js)"
      />
      <LinkBlock
        url="https://github.com/shaoruu/rust-typescript-template"
        blockName="Trophy (rust-typescript-template)"
      />
      <LinkBlock
        url="https://github.com/shaoruu/mc.js-legacy"
        blockName="Trophy (mc.js-legacy)"
      />
    </>
  );
}
