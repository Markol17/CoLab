import { Context } from "../types";
import { Ctx, FieldResolver, Resolver, Root } from "type-graphql";
import { Section } from "../entities/Section";
import { Link } from "../entities/Link";

@Resolver(Section)
export class SectionResolver {
	@FieldResolver(() => [Link])
	async links(@Root() section: Section, @Ctx() { sectionLinksLoader }: Context): Promise<Link[]> {
		return sectionLinksLoader.load(section.id);
	}
}
