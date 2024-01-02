package assets

import (
	"errors"
	"github.com/fzdwx/infinite"
	"github.com/fzdwx/infinite/components/input/text"
	"github.com/fzdwx/launcher/launcher-native/cmd/ray/common"
	"github.com/fzdwx/launcher/launcher-native/pkg/assets"
	"github.com/spf13/cobra"
	"strings"
)

func initCmd() *cobra.Command {
	var init = &cobra.Command{
		Use:     "init",
		Short:   "Init Config",
		Aliases: []string{"i"},
		Run: func(cmd *cobra.Command, args []string) {
			var (
				plat = "github"
			)

			repo, err := infinite.NewText(
				text.WithPrompt("请输入仓库名称"),
				text.WithPlaceholder("例如: fzdwx/assets", false),
			).Display()
			common.CheckIfError(err)
			token, err := infinite.NewText(
				text.WithPrompt("请输入Github token"),
			).Display()

			if strings.TrimSpace(repo) == "" {
				common.CheckIfError(errors.New("仓库名不能为空"))
			}
			if strings.TrimSpace(token) == "" {
				common.CheckIfError(errors.New("github token 不能为空"))
			}

			common.CheckIfError(assets.StoreConfig(&assets.Config{
				Plat: plat,
				Cfg: assets.GithubConfig{
					Repo:  repo,
					Token: token,
				},
			}))
		},
	}

	return init
}
